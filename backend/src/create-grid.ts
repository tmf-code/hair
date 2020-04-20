import { Vector2 } from './types';

const jitterRange = 0.05;
const widthPoints = 20;
const heightPoints = 20;

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

  return { grid, lengths };
};
export { createGrid };
