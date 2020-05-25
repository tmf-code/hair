import { InstancedMesh, Object3D } from 'three';
import { Buckets } from '../utilities/buckets';
import { EasingFunctions } from '../utilities/easing-functions';
import { FIFO } from '../utilities/fifo';
import { animationDuration } from '../utilities/constants';

type TriangleTransform = {
  type: 'empty' | 'useful';
  xPos: number;
  yPos: number;
  rotation: number;
  length: number;
  hairIndex: number;
  timeStamp: number;
};

class FallingHair {
  private static readonly emptyCutHair: TriangleTransform = {
    type: 'empty',
    xPos: 0,
    yPos: 0,
    rotation: 0,
    length: 0,
    hairIndex: -1,
    timeStamp: 0,
  };

  private viewport: { width: number; height: number; factor: number };
  private ref: React.MutableRefObject<InstancedMesh | undefined> | undefined;
  private maxFallingHair: number;
  private cutHairFIFO: FIFO<TriangleTransform>;

  private readonly animationDuration: number;
  private readonly transformHolder: Object3D = new Object3D();
  private hairRotations: number[];
  private hairPositions: [number, number][];

  constructor(totalHairCount: number, maxFallingHair: number) {
    this.cutHairFIFO = new FIFO<TriangleTransform>(
      maxFallingHair,
      FallingHair.emptyCutHair,
      'hairIndex',
    );

    this.maxFallingHair = maxFallingHair;
    this.animationDuration = animationDuration;

    this.viewport = { width: 1, height: 1, factor: 1 };

    const allZeros = [...new Array(totalHairCount)].fill(0);
    this.hairRotations = allZeros;
    this.hairPositions = allZeros;
  }

  public update(
    lengths: number[],
    cutEffect: boolean[],
    rotations: number[],
    positions: [number, number][],
  ) {
    this.hairRotations = rotations;
    this.hairPositions = positions;
    const cuts = this.createFallingHair(lengths, cutEffect);
    this.addUniqueToFIFO(cuts);
    this.makeHairFall();
  }

  private createFallingHair(lengths: number[], cutEffect: boolean[]) {
    return cutEffect
      .map((cut, index) => [cut, index] as [boolean, number])
      .filter(([isCut]) => isCut)
      .map(([, index]) => index)
      .map(
        (hairIndex): TriangleTransform => {
          const length = lengths[hairIndex];
          const [xPos, yPos] = this.hairPositions[hairIndex];
          const rotation = this.hairRotations[hairIndex];
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
      this.ref?.current?.setMatrixAt(
        this.hairPositions.length + index,
        this.transformHolder.matrix,
      );
    });
  }

  private addUniqueToFIFO(cuts: TriangleTransform[]) {
    cuts.forEach((cut) => this.cutHairFIFO.addIfUnique(cut));
  }

  setViewport(viewport: { width: number; height: number; factor: number }) {
    this.viewport = viewport;
  }

  setRef(ref: React.MutableRefObject<InstancedMesh | undefined>) {
    this.ref = ref;
  }
}
export { FallingHair };
