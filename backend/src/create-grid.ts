import { Vector2 } from './types';

const jitterRange = 0.05;
const widthPoints = 20;
const heightPoints = 20;
const rotationStart = 0;
const rotationEnd = 360;

const randRange = (minimum: number, maximum: number) =>
  Math.random() * (maximum - minimum) + minimum;
const jitter = ([xPosition, yPosition]: Vector2) =>
  [
    xPosition + randRange(-jitterRange, jitterRange),
    yPosition + randRange(-jitterRange, jitterRange),
  ] as Vector2;

// Create grid
const createGrid = () => {
  const grid = [...new Array(widthPoints * heightPoints)]
    .fill(0)
    .map((_, index) => [Math.floor(index / widthPoints), index % widthPoints])
    .map(([xPosition, yPosition]) => [xPosition / widthPoints, yPosition / heightPoints] as Vector2)
    .map(jitter);
  const lengths = grid.map(() => 0);

  const rotations: number[] = grid.map(() => randRange(rotationStart, rotationEnd));

  return { grid, lengths, rotations };
};
export { createGrid };
