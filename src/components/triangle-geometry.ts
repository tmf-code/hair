import { Shape, ShapeBufferGeometry } from 'three';
import { lerp } from '../utilities/utilities';
import { maxLengthAsPercentWidth, maxWidthAsPercentWidth } from '../utilities/constants';

const triangleGeometry = function (screenWidth: number) {
  const maxLength = lerp(0, screenWidth, maxLengthAsPercentWidth);
  const width = lerp(0, screenWidth, maxWidthAsPercentWidth);

  const maxLengthHairShape = makeTriangleShape(width, maxLength);
  const geo = new ShapeBufferGeometry(maxLengthHairShape);
  geo.computeVertexNormals();
  geo.scale(0.5, 0.5, 0.5);

  return geo;
};

const makeTriangleShape = (
  width: number,
  maxLength: number,
  position: [number, number, number] = [0, 0, 0],
) => {
  return new Shape()
    .moveTo(position[0], position[1])
    .lineTo(position[0] + width / 2.0, position[1] - maxLength)
    .lineTo(position[0] + width, position[1])
    .lineTo(position[0], position[1]);
};

export { triangleGeometry };
