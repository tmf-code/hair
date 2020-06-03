import { InstancedMesh, Object3D } from 'three';
import { Buckets } from '../../utilities/buckets';
import { FIFO } from '../../utilities/fifo';
import { animationDuration } from '../../utilities/constants';
import { FallingHair, IfallingHair } from './falling-hair';

class FallingHairs {
  private static readonly emptyCutHair: IfallingHair = {
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
  private cutHairFIFO: FIFO<IfallingHair, 'hairIndex'>;

  private readonly animationDuration: number;
  private readonly transformHolder: Object3D = new Object3D();
  private hairRotations: number[];
  private hairPositions: [number, number][];
  private hairLengths: number[];
  private hairCuts: boolean[];

  constructor(totalHairCount: number, maxFallingHair: number) {
    this.cutHairFIFO = new FIFO(maxFallingHair, FallingHairs.emptyCutHair, 'hairIndex');

    this.maxFallingHair = maxFallingHair;
    this.animationDuration = animationDuration;

    this.viewport = { width: 1, height: 1, factor: 1 };

    const allZeros = [...new Array(totalHairCount)].fill(0);
    this.hairRotations = allZeros;
    this.hairPositions = allZeros;
    this.hairLengths = allZeros;
    this.hairCuts = [...new Array(totalHairCount)].fill(false);
  }

  public update(
    lengths: number[],
    cutEffect: boolean[],
    rotations: number[],
    positions: [number, number][],
  ) {
    this.hairRotations = rotations;
    this.hairPositions = positions;
    this.hairLengths = lengths;
    this.hairCuts = cutEffect;
    const cutHairs = this.createCutHairs();
    this.addUniqueToFIFO(cutHairs);
    this.makeHairFall();
  }

  private createCutHairs() {
    const timeStamp = Date.now();
    const type = 'useful';
    const fallingHair: IfallingHair[] = [];

    for (let hairIndex = 0; hairIndex < this.hairCuts.length; hairIndex++) {
      const didCut = this.hairCuts[hairIndex];

      if (!didCut) continue;

      const length = this.hairLengths[hairIndex];
      const [xPos, yPos] = this.hairPositions[hairIndex];
      const rotation = this.hairRotations[hairIndex];

      fallingHair.push({
        xPos,
        yPos,
        rotation,
        length,
        type,
        hairIndex,
        timeStamp,
      });
    }

    return fallingHair;
  }

  private setTransform = (
    { xPos, yPos, distanceToDestination, rotation, length }: FallingHair,
    index: number,
  ) => {
    this.transformHolder.position.set(xPos, yPos - distanceToDestination, 0);
    this.transformHolder.rotation.set(0, 0, rotation);
    this.transformHolder.scale.set(1, length, 1);
    this.transformHolder.updateMatrix();
    this.ref?.current?.setMatrixAt(this.hairPositions.length + index, this.transformHolder.matrix);
  };

  private makeHairFall() {
    const frameTime = Date.now();
    const heightBuckets = new Buckets(10, -this.viewport.width / 2.0, this.viewport.width / 2.0);

    this.createFallingHair(heightBuckets, frameTime);
  }

  private getBucketHeight = (heightBuckets: Buckets, xPos: number) =>
    (heightBuckets.getCountOfBucketAtValue(xPos) * this.viewport.height) /
    this.maxFallingHair /
    heightBuckets.numBuckets;

  private createFallingHair = (heightBuckets: Buckets, frameTime: number) => {
    const hairs = this.cutHairFIFO.getStack();

    for (let hairIndex = hairs.length - 1; hairIndex >= 0; hairIndex--) {
      const transform = hairs[hairIndex];
      const { xPos, type } = transform;
      if (type === 'empty') continue;

      heightBuckets.add(xPos);

      const bucketHeight = this.getBucketHeight(heightBuckets, xPos);
      const fallingHair = new FallingHair(
        transform,
        this.animationDuration,
        frameTime,
        this.viewport.height,
        bucketHeight,
      );

      this.setTransform(fallingHair, hairIndex);
    }
  };

  private addUniqueToFIFO(cuts: IfallingHair[]) {
    cuts.forEach((cut) => this.cutHairFIFO.addIfUnique(cut));
  }

  setViewport(viewport: { width: number; height: number; factor: number }) {
    this.viewport = viewport;
  }

  setRef(ref: React.MutableRefObject<InstancedMesh | undefined>) {
    this.ref = ref;
  }
}
export { FallingHairs };
