import { Vector2 } from './types';
import { jitterRange, widthPoints, heightPoints, rotationStart, rotationEnd } from './constants';

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
    .map((_, index) => [index % widthPoints, Math.floor(index / widthPoints)])
    .map(([xPosition, yPosition]) => [xPosition / widthPoints, yPosition / heightPoints] as Vector2)
    .map(jitter);
  const lengths = grid.map(() => 0);

  const rotations: number[] = grid.map(() => randRange(rotationStart, rotationEnd));

  return { grid, lengths, rotations };
};
export { createGrid };
