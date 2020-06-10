import { Mouse } from '../mouse/mouse';
import { Vector3, Vector2 } from 'three';
import { swirlRadius } from '../../utilities/constants';

class HairRotations {
  // These holders are in place to stop continual recreation of objects in JS
  // This should improve performance and reduce garbage collector work
  private readonly mouseVelocityHolder = new Vector2();
  private readonly positionHolder = new Vector3();

  private initialRotations: number[];
  private rotations: number[];
  private rotationOffsets: number[];

  constructor(size: number) {
    const allZeros = [...new Array(size)].fill(0);

    this.initialRotations = allZeros;
    this.rotations = allZeros;
    this.rotationOffsets = allZeros;
  }

  setInitialRotations(rotations: number[]) {
    this.initialRotations = [...rotations];
    this.rotations = [...this.initialRotations];
    this.rotationOffsets = this.initialRotations.map(() => 0);
  }

  getRotations() {
    return this.rotations;
  }

  calculateSwirls(positions: [number, number][], mousePos: Vector3) {
    const mouseVelocity = this.mouseVelocityHolder.fromArray(Mouse.getVelocity());
    const isMousePerformingSwirl =
      !Mouse.isClicked() && !Mouse.isSingleTouched() && mouseVelocity.length() > 0.001;

    if (!isMousePerformingSwirl) return;

    for (let hairIndex = 0; hairIndex < this.rotations.length; hairIndex++) {
      const [xPos, yPos] = positions[hairIndex];

      const distance = mousePos.distanceTo(this.positionHolder.set(xPos, yPos, 0));
      const isHovering = distance < swirlRadius;

      if (!isHovering) continue;

      const offset = this.getRotationOffset(distance, mouseVelocity, hairIndex);

      this.setRotationOffset(offset, hairIndex);
    }
  }

  private getRotationOffset(distance: number, mouseVelocity: Vector2, hairIndex: number) {
    const directionVector = mouseVelocity.normalize();
    const swirlAmount = directionVector.multiplyScalar(1 - distance / swirlRadius);

    const rotationDifference =
      Math.atan2(swirlAmount.y, swirlAmount.x) - this.rotationOffsets[hairIndex];
    const newRotation =
      this.rotationOffsets[hairIndex] + (rotationDifference * swirlAmount.length()) / 10;
    return newRotation;
  }

  private setRotationOffset(offset: number, hairIndex: number) {
    this.rotationOffsets[hairIndex] = offset;
    const rotation = this.initialRotations[hairIndex];
    const rotationOffset = this.rotationOffsets[hairIndex];
    this.rotations[hairIndex] = rotation + rotationOffset;
  }
}

export { HairRotations };
