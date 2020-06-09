import { Object3D } from 'three';

export const transformObject3D = (
  object: Object3D,
  position: [number, number, number],
  rotation: [number, number, number],
  scale: [number, number, number],
) => {
  object.position.set(...position);
  object.rotation.set(...rotation);
  object.scale.set(...scale);
  object.updateMatrix();

  return object.matrix;
};
