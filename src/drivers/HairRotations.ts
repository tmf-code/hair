import { Vector3, Vector2 } from 'three';
import { Mouse } from './Mouse';
import { swirlRadius } from '../utilities/constants';

class HairRotations {
  private initialRotations: number[] = [];
  private rotations: number[] = [];
  private rotationOffsets: number[] = [];

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
    const swirlAffect = positions.map(([xPos, yPos]) => {
      const directionVector = Mouse.VelocityVector().normalize();
      const distance = mousePos.distanceTo(new Vector3(xPos, yPos, 0));
      const hover = distance < swirlRadius;
      const shouldSwirl = hover && !Mouse.isClicked() && Mouse.VelocityVector().length() > 0.001;
      return shouldSwirl
        ? directionVector.multiplyScalar(1 - distance / swirlRadius)
        : new Vector2(0, 0);
    });

    const newRotationOffsets = swirlAffect.map((swirlAmount, hairIndex) => {
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
