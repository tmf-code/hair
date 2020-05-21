import { Rotations, HairLengths } from '../types/types';
import { TriangleTransform } from './Triangles';
import { InstancedMesh, Object3D } from 'three';
import { Buckets } from '../utilities/buckets';
import { EasingFunctions } from '../utilities/easing-functions';
import { FIFO } from '../utilities/fifo';

export class FallingHair {
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

  static makeHairFall(
    viewport: {
      width: number;
      height: number;
      factor: number;
    },
    grid: [number, number][],
    ref: React.MutableRefObject<InstancedMesh | undefined>,
    cutHairFIFO: FIFO<TriangleTransform>,
    maxFallingHair: number,
    transformHolder: Object3D,
  ) {
    const frameTime = Date.now();
    const animationDuration = 800;
    const heightBuckets = new Buckets(10, -viewport.width / 2.0, viewport.width / 2.0);
    cutHairFIFO.stack.forEach((transform, index) => {
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
}
