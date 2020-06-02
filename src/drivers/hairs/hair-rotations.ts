import { Mouse } from '../mouse/mouse';
import { Vector3, Vector2 } from 'three';
import { swirlRadius } from '../../utilities/constants';

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

    for (let index = 0; index < this.initialRotations.length; index++) {
      const rotation = this.initialRotations[index];
      const rotationOffset = this.rotationOffsets[index];
      this.rotations[index] = rotation + rotationOffset;
    }
  }

  setInitialRotations(rotations: number[]) {
    this.initialRotations = [...rotations];
    this.rotations = [...this.initialRotations];
    this.rotationOffsets = this.initialRotations.map(() => 0);
  }

  getRotations() {
    return this.rotations;
  }

  private noSwirl = (hairIndex: number) => this.rotationOffsets[hairIndex];

  calculateSwirls = (positions: number[][], mousePos: Vector3) => {
    const mouseVelocity = new Vector2().fromArray(Mouse.getVelocity());
    const isMousePerformingSwirl =
      !Mouse.isClicked() && !Mouse.isSingleTouched() && mouseVelocity.length() > 0.001;

    const newRotationOffsets = positions.map(([xPos, yPos], hairIndex) => {
      if (!isMousePerformingSwirl) return this.noSwirl(hairIndex);

      const distance = mousePos.distanceTo(new Vector3(xPos, yPos, 0));
      const isHovering = distance < swirlRadius;

      if (!isHovering) return this.noSwirl(hairIndex);

      const directionVector = mouseVelocity.normalize();
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
