import { Vector3 } from 'three';
import { Mouse } from './Mouse';
import { swirlRadius } from '../utilities/constants';

class HairRotations {
  private initialRotations: number[];
  private rotations: number[];
  private rotationOffsets: number[];

  constructor(size: number) {
    const allZeros = [...new Array(size)].fill(0);

    this.initialRotations = allZeros;
    this.rotations = allZeros;
    this.rotationOffsets = allZeros;
  }

  setRotationOffsets(offsets: number[]) {
    this.rotationOffsets = offsets;
    this.rotations = this.initialRotations.map(
      (value, index) => value + this.rotationOffsets[index],
    );
  }

  setInitialRotations(rotations: number[]) {
    this.initialRotations = rotations;
    this.rotations = this.initialRotations;
    this.rotationOffsets = this.initialRotations.map(() => 0);
  }

  getRotations() {
    return this.rotations;
  }

  calculateSwirls = (positions: number[][], mousePos: Vector3) => {
    const isMousePerformingSwirl = !Mouse.isClicked() && Mouse.VelocityVector().length() > 0.001;
    const noSwirl = (hairIndex: number) => this.rotationOffsets[hairIndex];

    const newRotationOffsets = positions.map(([xPos, yPos], hairIndex) => {
      if (!isMousePerformingSwirl) return noSwirl(hairIndex);

      const distance = mousePos.distanceTo(new Vector3(xPos, yPos, 0));
      const isHovering = distance < swirlRadius;

      if (!isHovering) return noSwirl(hairIndex);

      const directionVector = Mouse.VelocityVector().normalize();
      const swirlAmount = directionVector.multiplyScalar(1 - distance / swirlRadius);

      const rotationDifference =
        Math.atan2(swirlAmount.y, swirlAmount.x) - this.rotationOffsets[hairIndex];
      const newRotation =
        this.rotationOffsets[hairIndex] + (rotationDifference * swirlAmount.length()) / 10;
      return newRotation;
    });

    this.setRotationOffsets(newRotationOffsets);
  };
}

export { HairRotations };
