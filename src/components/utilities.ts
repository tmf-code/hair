import { Camera, Vector3 } from 'three';

export const lerp = function (value1: number, value2: number, amount: number) {
  amount = amount < 0 ? 0 : amount;
  amount = amount > 1 ? 1 : amount;
  return value1 + (value2 - value1) * amount;
};

export const arrayEqual = (array1: number[], array2: number[]) => {
  return array2.every((element, index) => array1[index] === element);
};

export const getWorldLimits = (camera: Camera | undefined) => {
  if (!camera) return { leftTop: new Vector3(0, 0, 0), rightBottom: new Vector3(1, 1, 0) };
  const getWorldPos = (xPos: number, yPos: number) => {
    const pos = new Vector3();
    const vec = new Vector3();
    vec.set((xPos / window.innerWidth) * 2 - 1, -(yPos / window.innerHeight) * 2 + 1, 0);
    vec.unproject(camera);
    vec.sub(camera.position).normalize();
    const distance = -camera.position.z / vec.z;
    return pos.copy(camera.position).add(vec.multiplyScalar(distance));
  };

  return {
    leftTop: getWorldPos(0, 0),
    rightBottom: getWorldPos(window.innerWidth, window.innerHeight),
  };
};

export type WorldLimits = ReturnType<typeof getWorldLimits>;
