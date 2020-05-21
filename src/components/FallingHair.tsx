import { Rotations, HairLengths, Grid } from '../types/types';
import { InstancedMesh, Object3D } from 'three';
import { Buckets } from '../utilities/buckets';
import { EasingFunctions } from '../utilities/easing-functions';
import { FIFO } from '../utilities/fifo';

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
  static readonly emptyCutHair: TriangleTransform = {
    type: 'empty',
    xPos: 0,
    yPos: 0,
    rotation: 0,
    length: 0,
    hairIndex: -1,
    timeStamp: 0,
  };
  cutHairFIFO: FIFO<TriangleTransform>;
  constructor(maxFallingHair: number) {
    this.cutHairFIFO = new FIFO<TriangleTransform>(
      maxFallingHair,
      FallingHair.emptyCutHair,
      'hairIndex',
    );
  }

  static createFallingHair(rotations: Rotations, rotationOffsets: Rotations) {
    return (positions: number[][], lengths: HairLengths, cutAffect: boolean[]) =>
      cutAffect
        .map((cut, index) => [cut, index] as [boolean, number])
        .filter(([isCut]) => isCut)
        .map(([, index]) => index)
        .map(
          (hairIndex): TriangleTransform => {
            const length = lengths[hairIndex];
            const [xPos, yPos] = positions[hairIndex];
            const rotation = rotations[hairIndex] + rotationOffsets[hairIndex];
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

  makeHairFall(
    viewport: {
      width: number;
      height: number;
      factor: number;
    },
    grid: [number, number][],
    ref: React.MutableRefObject<InstancedMesh | undefined>,
    maxFallingHair: number,
    transformHolder: Object3D,
  ) {
    const frameTime = Date.now();
    const animationDuration = 800;
    const heightBuckets = new Buckets(10, -viewport.width / 2.0, viewport.width / 2.0);
    this.cutHairFIFO.stack.forEach((transform, index) => {
      const { xPos, yPos, rotation, length, timeStamp, type } = transform;

      if (type === 'empty') return;
      const bucketHeight =
        (heightBuckets.add(xPos) * viewport.height) / maxFallingHair / heightBuckets.numBuckets;
      const animationProgression = Math.min((frameTime - timeStamp) / animationDuration, 1.0);

      const destination = -viewport.height / 2.0 + Math.abs(yPos / 8.0) + bucketHeight;
      const distance = (yPos - destination) * EasingFunctions.easeInQuad(animationProgression);

      transformHolder.position.set(xPos, yPos - distance, 0);
      transformHolder.rotation.set(0, 0, rotation);
      transformHolder.scale.set(1, length, 1);
      transformHolder.updateMatrix();
      ref.current?.setMatrixAt(grid.length + index, transformHolder.matrix);
    });
  }

  public update(
    positions: number[][],
    lastLengths: HairLengths,
    cutAffect: boolean[],
    rotations: Rotations,
    rotationOffsets: Rotations,
    viewport: {
      width: number;
      height: number;
      factor: number;
    },
    grid: Grid,
    ref: React.MutableRefObject<InstancedMesh | undefined>,
    maxFallingHair: number,
    transformHolder: Object3D,
  ) {
    const cuts = FallingHair.calculateCuts(
      positions,
      lastLengths,
      cutAffect,
      rotations,
      rotationOffsets,
    );

    this.addUniqueToFIFO(cuts);
    this.makeHairFall(viewport, grid, ref, maxFallingHair, transformHolder);
  }

  static calculateCuts(
    positions: number[][],
    lastLengths: HairLengths,
    cutAffect: boolean[],
    rotations: Rotations,
    rotationOffsets: Rotations,
  ) {
    const fallingHair = FallingHair.createFallingHair(rotations, rotationOffsets);
    return fallingHair(positions, lastLengths, cutAffect);
  }

  addUniqueToFIFO(cuts: TriangleTransform[]) {
    cuts.forEach((cut) => this.cutHairFIFO.addIfUnique(cut));
  }
}
