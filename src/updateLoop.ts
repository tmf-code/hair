import { Mouse } from './drivers/Mouse';
import { Socket } from './drivers/Socket';
import { Grid, Vector2 } from './types/types';

const scaleLengths = (lengthsRelative: number[], lengthScalingFactor: number) => {
  const lengths = lengthsRelative.map((length) => length * lengthScalingFactor);

  return lengths;
};

const scaleGrid = (gridRelative: Grid) => {
  const grid = gridRelative.map(
    ([xPos, yPos]) => [xPos * window.innerWidth, yPos * window.innerHeight] as Vector2,
  );

  return grid;
};

const getCutHairs = (grid: Grid, mousePosition: Vector2, isClicked: boolean) => {
  const [mouseX, mouseY] = mousePosition;

  // Calcuate trims
  const sqrRadius = 20 * 20;

  const cutHairs = grid
    .map(([hairX, hairY]: Vector2, gridIndex: number) => {
      // Mouse hitting
      const distanceVector = [hairX - mouseX, hairY - mouseY];
      const isInXRange = Math.abs(distanceVector[0]) < 125;
      const isInYRange = Math.abs(distanceVector[1]) < 25;

      // const sqrDistance =
      //   distanceVector[0] * distanceVector[0] + distanceVector[1] * distanceVector[1];
      // const isMouseOver = sqrDistance < sqrRadius;
      return isInXRange && isInYRange && isClicked ? gridIndex : undefined;
    })
    .filter(Number) as number[];

  return cutHairs;
};

const getHairLengths = (cutHairs: number[], lengths: number[], lengthScalingFactor: number) => {
  const updatedLengths = lengths.map((length: number, lengthIndex: number) => {
    return cutHairs.includes(lengthIndex) ? 0 : length;
  });

  const updatedRelativeLengths = updatedLengths.map((length) => length / lengthScalingFactor);

  return updatedRelativeLengths;
};

const updateState = (socket: Socket) => {
  const { grid: gridRelative, lengths: lengthsRelative, rotations } = socket;
  const lengthScalingFactor = Math.max(window.innerWidth, window.innerHeight);

  const grid = scaleGrid(gridRelative);
  const absoluteLengths = scaleLengths(lengthsRelative, lengthScalingFactor);
  const mousePosition = Mouse.Position();
  const isClicked = Mouse.isClicked();

  const cutHairs = getCutHairs(grid, mousePosition, isClicked);
  const relativelengths = getHairLengths(cutHairs, absoluteLengths, lengthScalingFactor);

  const maxDimension = Math.max(window.innerWidth, window.innerHeight) * 2.5;
  const thickness = 0.003 * maxDimension;

  return {
    rotations,
    grid,
    relativelengths,
    absoluteLengths,
    mousePosition,
    cutHairs,
  };
};

export { updateState };
