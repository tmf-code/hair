import { Object3D } from 'three';

const transformHolder = new Object3D();
transformHolder.matrixAutoUpdate = false;

export const getMatrixFromTransform = (
  position: [number, number, number],
  rotation: [number, number, number],
  scale: [number, number, number],
) => {
  transformHolder.position.set(...position);
  transformHolder.rotation.set(...rotation);
  transformHolder.scale.set(...scale);
  transformHolder.updateMatrix();

  return transformHolder.matrix;
};
