import { hairLayer } from './../../utilities/constants';
import { InstancedMesh, Object3D } from 'three';

type Tuple3<T> = [T, T, T];

class NoUpdateObject3D extends Object3D {
  constructor() {
    super();
    this.matrixAutoUpdate = false;
  }
}

export class HairRenderer {
  private static readonly transformHolder = new NoUpdateObject3D();

  static render(
    mesh: InstancedMesh,
    hairIndex: number,
    xPos: number,
    yPos: number,
    zRotation: number,
    width: number,
    length: number,
    aspect: number,
  ) {
    const hairLengthScale = HairRenderer.getHairLengthScale(aspect);
    const hairWidthScale = HairRenderer.getHairWidthScale(aspect);

    const zPos = hairLayer;

    const position: Tuple3<number> = [xPos, yPos, zPos];
    const rotation: Tuple3<number> = [0, 0, zRotation];
    const scale: Tuple3<number> = [width * hairWidthScale, length * hairLengthScale, 1];

    const matrix = HairRenderer.getMatrixFromTransform(position, rotation, scale);
    mesh.setMatrixAt(hairIndex, matrix);
  }

  static getMatrixFromTransform = (
    position: [number, number, number],
    rotation: [number, number, number],
    scale: [number, number, number],
  ) => {
    HairRenderer.transformHolder.position.set(...position);
    HairRenderer.transformHolder.rotation.set(...rotation);
    HairRenderer.transformHolder.scale.set(...scale);
    HairRenderer.transformHolder.updateMatrix();

    return HairRenderer.transformHolder.matrix;
  };

  static getHairLengthScale(aspect: number) {
    return 2 / aspect;
  }

  static getHairWidthScale(aspect: number) {
    return 2 / aspect;
  }
}
