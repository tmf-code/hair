import { Rotations, HairLengths } from '../types/types';
import { TriangleTransform } from './Triangles';
export function createFallingHair(rotations: Rotations, rotationOffsets: Rotations) {
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
