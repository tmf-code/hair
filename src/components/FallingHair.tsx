import { InstancedMesh, Object3D } from 'three';
import { Buckets } from '../utilities/buckets';
import { EasingFunctions } from '../utilities/easing-functions';
import { FIFO } from '../utilities/fifo';
import { maxFallingHair, animationDuration } from '../utilities/constants';
import { HairRotations } from '../drivers/HairRotations';
import { HairPositions } from '../drivers/HairPositions';

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

  private viewport: { width: number; height: number; factor: number };
  private ref: React.MutableRefObject<InstancedMesh | undefined>;
  private maxFallingHair: number;
  private cutHairFIFO: FIFO<TriangleTransform>;

  private readonly animationDuration: number;
  private readonly transformHolder: Object3D;
  hairRotations: HairRotations;
  hairPositions: HairPositions;

  constructor(
    hairPositions: HairPositions,
    viewport: { width: number; height: number; factor: number },
    ref: React.MutableRefObject<InstancedMesh | undefined>,
    transformHolder: Object3D,
    hairRotations: HairRotations,
  ) {
    this.cutHairFIFO = new FIFO<TriangleTransform>(
      maxFallingHair,
      FallingHair.emptyCutHair,
      'hairIndex',
    );

    this.hairPositions = hairPositions;
    this.ref = ref;
    this.viewport = viewport;
    this.maxFallingHair = maxFallingHair;
    this.animationDuration = animationDuration;
    this.transformHolder = transformHolder;
    this.hairRotations = hairRotations;
  }

  private createFallingHair(lengths: number[], cutEffect: boolean[]) {
    const positions = this.hairPositions.getScreenPositions();
    const rotations = this.hairRotations.getRotations();
    return cutEffect
      .map((cut, index) => [cut, index] as [boolean, number])
      .filter(([isCut]) => isCut)
      .map(([, index]) => index)
      .map(
        (hairIndex): TriangleTransform => {
          const length = lengths[hairIndex];
          const [xPos, yPos] = positions[hairIndex];
          const rotation = rotations[hairIndex];
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
      this.ref.current?.setMatrixAt(
        this.hairPositions.getPositions().length + index,
        this.transformHolder.matrix,
      );
    });
  }

  public update(lastLengths: number[], cutEffect: boolean[]) {
    const cuts = this.calculateCuts(lastLengths, cutEffect);
    this.addUniqueToFIFO(cuts);
    this.makeHairFall();
  }

  private calculateCuts(lastLengths: number[], cutEffect: boolean[]) {
    return this.createFallingHair(lastLengths, cutEffect);
  }

  private addUniqueToFIFO(cuts: TriangleTransform[]) {
    cuts.forEach((cut) => this.cutHairFIFO.addIfUnique(cut));
  }
}
