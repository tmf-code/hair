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

  private noSwirl(hairIndex: number) {
    return this.rotationOffsets[hairIndex];
  }

  calculateSwirls(positions: [number, number][], mousePos: Vector3) {
    const mouseVelocity = this.mouseVelocityHolder.fromArray(Mouse.getVelocity());
    const isMousePerformingSwirl =
      !Mouse.isClicked() && !Mouse.isSingleTouched() && mouseVelocity.length() > 0.001;

    const newRotationOffsets = positions.map(([xPos, yPos], hairIndex) =>
      this.getRotationOffset(
        isMousePerformingSwirl,
        mousePos,
        mouseVelocity,
        [xPos, yPos],
        hairIndex,
      ),
    );

    this.setRotationOffsets(newRotationOffsets);
  }

  private getRotationOffset(
    isMousePerformingSwirl: boolean,
    mousePos: Vector3,
    mouseVelocity: Vector2,
    [xPos, yPos]: [number, number],
    hairIndex: number,
  ) {
    if (!isMousePerformingSwirl) return this.noSwirl(hairIndex);

    const distance = mousePos.distanceTo(this.positionHolder.set(xPos, yPos, 0));
    const isHovering = distance < swirlRadius;

    if (!isHovering) return this.noSwirl(hairIndex);

    const directionVector = mouseVelocity.normalize();
    const swirlAmount = directionVector.multiplyScalar(1 - distance / swirlRadius);

    const rotationDifference =
      Math.atan2(swirlAmount.y, swirlAmount.x) - this.rotationOffsets[hairIndex];
    const newRotation =
      this.rotationOffsets[hairIndex] + (rotationDifference * swirlAmount.length()) / 10;
    return newRotation;
  }
}

export { HairRotations };
