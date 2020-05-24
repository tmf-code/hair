import { Rotations, Grid } from '../types/types';
import { InstancedMesh, Object3D } from 'three';
import { Buckets } from '../utilities/buckets';
import { EasingFunctions } from '../utilities/easing-functions';
import { FIFO } from '../utilities/fifo';
import { maxFallingHair, animationDuration } from '../utilities/constants';

type TriangleTransform = {
  type: 'empty' | 'useful';
  xPos: number;
  yPos: number;
  rotation: number;
  length: number;
  hairIndex: number;
  timeStamp: number;
};

export class FallingHair {
  private static readonly emptyCutHair: TriangleTransform = {
    type: 'empty',
    xPos: 0,
    yPos: 0,
    rotation: 0,
    length: 0,
    hairIndex: -1,
    timeStamp: 0,
  };

  private positions: Grid;
  private viewport: { width: number; height: number; factor: number };
  private ref: React.MutableRefObject<InstancedMesh | undefined>;
  private grid: Grid;
  private maxFallingHair: number;
  private cutHairFIFO: FIFO<TriangleTransform>;
  private rotations: Rotations;

  private readonly animationDuration: number;
  private readonly transformHolder: Object3D;

  constructor(
    positions: Grid,
    rotations: Rotations,
    viewport: { width: number; height: number; factor: number },
    ref: React.MutableRefObject<InstancedMesh | undefined>,
    grid: Grid,
    transformHolder: Object3D,
  ) {
    this.cutHairFIFO = new FIFO<TriangleTransform>(
      maxFallingHair,
      FallingHair.emptyCutHair,
      'hairIndex',
    );

    this.positions = positions;
    this.rotations = rotations;
    this.grid = grid;
    this.ref = ref;
    this.viewport = viewport;
    this.maxFallingHair = maxFallingHair;
    this.animationDuration = animationDuration;
    this.transformHolder = transformHolder;
  }

  private createFallingHair(rotationOffsets: Rotations, lengths: number[], cutEffect: boolean[]) {
    return cutEffect
      .map((cut, index) => [cut, index] as [boolean, number])
      .filter(([isCut]) => isCut)
      .map(([, index]) => index)
      .map(
        (hairIndex): TriangleTransform => {
          const length = lengths[hairIndex];
          const [xPos, yPos] = this.positions[hairIndex];
          const rotation = this.rotations[hairIndex] + rotationOffsets[hairIndex];
          return {
            xPos,
            yPos,
            rotation,
            length,
            type: 'useful',
            hairIndex,
            timeStamp: Date.now(),
          };
        },
      );
  }

  private makeHairFall() {
    const frameTime = Date.now();

    const heightBuckets = new Buckets(10, -this.viewport.width / 2.0, this.viewport.width / 2.0);
    this.cutHairFIFO.stack.forEach((transform, index) => {
      const { xPos, yPos, rotation, length, timeStamp, type } = transform;

      if (type === 'empty') return;
      const bucketHeight =
        (heightBuckets.add(xPos) * this.viewport.height) /
        this.maxFallingHair /
        heightBuckets.numBuckets;
      const animationProgression = Math.min((frameTime - timeStamp) / this.animationDuration, 1.0);

      const destination = -this.viewport.height / 2.0 + Math.abs(yPos / 8.0) + bucketHeight;
      const distance = (yPos - destination) * EasingFunctions.easeInQuad(animationProgression);

      this.transformHolder.position.set(xPos, yPos - distance, 0);
      this.transformHolder.rotation.set(0, 0, rotation);
      this.transformHolder.scale.set(1, length, 1);
      this.transformHolder.updateMatrix();
      this.ref.current?.setMatrixAt(this.grid.length + index, this.transformHolder.matrix);
    });
  }

  public update(lastLengths: number[], cutEffect: boolean[], rotationOffsets: Rotations) {
    const cuts = this.calculateCuts(lastLengths, cutEffect, rotationOffsets);
    this.addUniqueToFIFO(cuts);
    this.makeHairFall();
  }

  private calculateCuts(lastLengths: number[], cutEffect: boolean[], rotationOffsets: Rotations) {
    return this.createFallingHair(rotationOffsets, lastLengths, cutEffect);
  }

  private addUniqueToFIFO(cuts: TriangleTransform[]) {
    cuts.forEach((cut) => this.cutHairFIFO.addIfUnique(cut));
  }
}
