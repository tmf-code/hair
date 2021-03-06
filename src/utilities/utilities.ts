import { Camera, Vector3, Vector2 } from 'three';

export const lerp = function (value1: number, value2: number, amount: number): number {
  amount = amount < 0 ? 0 : amount;
  amount = amount > 1 ? 1 : amount;
  return value1 + (value2 - value1) * amount;
};

export const lerpTuple2 = function (
  from: [number, number],
  to: [number, number],
  amount: number,
): [number, number] {
  return mapOnZipped(from, to, (fromElement, toElement) =>
    lerp(fromElement, toElement, amount),
  ) as [number, number];
};

export const lerpTuple3 = function (
  from: [number, number, number],
  to: [number, number, number],
  amount: number,
): [number, number, number] {
  return mapOnZipped(from, to, (fromElement, toElement) =>
    lerp(fromElement, toElement, amount),
  ) as [number, number, number];
};

export const relativeToWorld = (position: [number, number], camera: Camera): Vector3 => {
  const vec = new Vector3(...position, 0);
  vec.unproject(camera);
  vec.sub(camera.position).normalize();
  const distance = -camera.position.z / vec.z;
  return new Vector3().copy(camera.position).add(vec.multiplyScalar(distance));
};

export const mouseToWorld = (mouse: Vector2, camera: Camera): Vector3 => {
  const vec = new Vector3(mouse.x, mouse.y, 0);
  vec.unproject(camera);
  vec.sub(camera.position).normalize();
  const distance = -camera.position.z / vec.z;
  return new Vector3().copy(camera.position).add(vec.multiplyScalar(distance));
};

export const mapOnZipped = <T, U>(
  arrayA: T[],
  arrayB: T[],
  callback: (elementA: T, elementB: T, index: number) => U,
): U[] => {
  if (arrayA.length !== arrayB.length)
    throw new RangeError(
      `Unable to combine arrayA with arrayB. Lengths ${arrayA.length} and ${arrayB.length} do not match`,
    );

  const result: U[] = [];
  for (let index = 0; index < arrayA.length; index++) {
    const elementInA = arrayA[index];
    const elementInB = arrayB[index];

    const callbackResult = callback(elementInA, elementInB, index);
    result.push(callbackResult);
  }

  return result;
};

export const lerpTheta = (
  current: number,
  target: number,
  interpolation: number,
  circleAt: number,
): number => {
  const removeLoops = (distance: number) =>
    clamp(distance - Math.floor(distance / circleAt) * circleAt, 0, circleAt);

  const distance = target - current;
  const unloopedDistance = removeLoops(distance);
  const isLeft = unloopedDistance > Math.PI;
  const offset = isLeft ? unloopedDistance - Math.PI * 2 : unloopedDistance;
  return lerp(current, current + offset, interpolation);
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(min, value), max);
