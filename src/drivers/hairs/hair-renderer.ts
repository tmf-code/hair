import { InstancedMesh } from 'three';
import { getMatrixFromTransform } from '../../utilities/get-matrix-from-transform';

type Tuple3<T> = [T, T, T];

export class HairRenderer {
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

    const position: Tuple3<number> = [xPos, yPos, 0];
    const rotation: Tuple3<number> = [0, 0, zRotation];
    const scale: Tuple3<number> = [width * hairWidthScale, length * hairLengthScale, 1];

    const matrix = getMatrixFromTransform(position, rotation, scale);
    mesh.setMatrixAt(hairIndex, matrix);
  }

  static getHairLengthScale(aspect: number) {
    return 2 / aspect;
  }

  static getHairWidthScale(aspect: number) {
    return 2 / aspect;
  }
}
