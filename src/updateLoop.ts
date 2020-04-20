import { Mouse } from './drivers/Mouse';
import { Socket } from './drivers/Socket';
import { Grid, Vector2, CutHair, HairLengths } from './types/types';

const scaleLengths = (lengthsRelative: number[], lengthScalingFactor: number) => {
  const lengths = lengthsRelative.map((length) => Math.min(length * lengthScalingFactor, 80));

  return lengths;
};

const scaleGrid = (gridRelative: Grid) => {
  const grid = gridRelative.map(
    ([xPos, yPos]) => [xPos * window.innerWidth, yPos * window.innerHeight] as Vector2,
  );

  return grid;
};

const getCutHairs = (
  grid: Grid,
  mousePosition: Vector2,
  isClicked: boolean,
  absoluteHairLengths: HairLengths,
): CutHair[] => {
  const [mouseX, mouseY] = mousePosition;
  const currentTime = new Date().getTime();

  if (!isClicked) {
    return [];
  }

  const cutHairs = grid
    .map(([hairX, hairY]: Vector2, gridIndex: number) => {
      // Mouse hitting
      const distanceVector = [hairX - mouseX, hairY - mouseY];
      const isInXRange = Math.abs(distanceVector[0]) < 125;
      const isInYRange = Math.abs(distanceVector[1]) < 25;
      return isInXRange && isInYRange && isClicked ? gridIndex : undefined;
    })
    .filter((hairIndex) => hairIndex !== undefined)
    .map((hairIndex) => [hairIndex, currentTime, absoluteHairLengths[hairIndex!]]) as CutHair[];

  return cutHairs;
};

const getHairLengths = (cutHairs: number[], lengths: number[], lengthScalingFactor: number) =>
  lengths.map((length: number, lengthIndex: number) =>
    cutHairs.includes(lengthIndex) ? 0 : length / lengthScalingFactor,
  );

const updateState = (socket: Socket) => {
  const { grid: gridRelative, lengths: lengthsRelative, rotations } = socket;
  const lengthScalingFactor = Math.max(window.innerWidth, window.innerHeight);

  const grid = scaleGrid(gridRelative);
  const absoluteLengths = scaleLengths(lengthsRelative, lengthScalingFactor);
  const mousePosition = Mouse.Position();
  const isClicked = Mouse.isClicked();

  const cutHairs = getCutHairs(grid, mousePosition, isClicked, absoluteLengths);
  const relativeLengths = getHairLengths(
    cutHairs.map((hair) => hair[0]),
    absoluteLengths,
    lengthScalingFactor,
  );

  return {
    rotations,
    grid,
    relativeLengths,
    absoluteLengths,
    mousePosition,
    cutHairs,
  };
};

export { updateState };
