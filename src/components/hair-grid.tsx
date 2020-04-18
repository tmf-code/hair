import { Grid } from './grid';
import { Hair } from './hair';
import React from 'react';

type Vector = [number, number];

const randRange = (minimum: number, maximum: number) =>
  Math.random() * (maximum - minimum) + minimum;

export type HairGridProps = {
  screenWidth: number;
  screenHeight: number;
};

export const HairGrid = ({ screenWidth, screenHeight }: HairGridProps) => {
  const maxDimension = Math.max(screenWidth, screenHeight) * 2.5;

  const cellWidth = 0.01 * maxDimension;
  const cellHeight = 0.01 * maxDimension;
  const thickness = 0.003 * maxDimension;
  const positionJitterRange = 0.005 * maxDimension;
  const growthMin = 0.00003 * maxDimension;
  const growthMax = 0.00008 * maxDimension;
  const lengthMin = 0.01 * maxDimension;
  const lengthMax = 0.028 * maxDimension;

  const directionLeft = -0.1;
  const directionRight = 0.8;

  const positions = Grid(screenWidth, screenHeight, cellWidth, cellHeight).map((position) => {
    let jitter: Vector = [
      randRange(-positionJitterRange, positionJitterRange),
      randRange(-positionJitterRange, positionJitterRange),
    ];
    return (position = [position[0] + jitter[0], position[1] + jitter[1]]);
  });

  const directions: Vector[] = positions.map(() => [randRange(directionLeft, directionRight), 1]);

  const growthRates = positions.map(() => randRange(growthMin, growthMax));
  const maximumLengths = positions.map(() => randRange(lengthMin, lengthMax));

  const color: string = 'rgba(0 0 0 200)';

  const grid = positions.map((position, index) => (
    <Hair
      tipX={position[0]}
      tipY={position[1] + maximumLengths[index]}
      bottomLeftX={position[0] - thickness / 2}
      bottomLeftY={position[1]}
      bottomRightX={position[0] + thickness / 2}
      bottomRightY={position[1]}
      color={color}
    />
  ));
  return <>{grid}</>;
};
