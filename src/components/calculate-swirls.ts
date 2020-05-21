import { Mouse } from '../drivers/Mouse';
import { swirlRadius } from '../utilities/constants';
import { Vector3, Vector2 } from 'three';
import { HairLengths, Rotations } from '../types/types';

export const calculateSwirls = (
  positions: number[][],
  mousePos: Vector3,
  lastLengths: HairLengths,
  rotationOffsets: Rotations,
) => {
  const swirlAffect = lastLengths.map((_length, lengthIndex) => {
    const directionVector = Mouse.VelocityVector().normalize();
    const [xPos, yPos] = positions[lengthIndex];
    const distance = mousePos.distanceTo(new Vector3(xPos, yPos, 0));
    const hover = distance < swirlRadius;
    const shouldSwirl = hover && !Mouse.isClicked() && Mouse.VelocityVector().length() > 0.001;
    return shouldSwirl
      ? directionVector.multiplyScalar(1 - distance / swirlRadius)
      : new Vector2(0, 0);
  });

  return swirlAffect.map((swirlAmount, hairIndex) => {
    const rotationDifference =
      Math.atan2(swirlAmount.y, swirlAmount.x) - rotationOffsets[hairIndex];
    const newRotation =
      rotationOffsets[hairIndex] + (rotationDifference * swirlAmount.length()) / 10;
    return newRotation;
  });
};
