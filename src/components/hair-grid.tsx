import { Hair } from './hair';
import React from 'react';

type Vector = [number, number];
type Grid = Vector[];
type Lengths = number[];

export type HairGridProps = {
  lengths: Lengths;
  grid: Grid;
  screenWidth: number;
  screenHeight: number;
};

export const HairGrid = ({ lengths, grid, screenWidth, screenHeight }: HairGridProps) => {
  const maxDimension = Math.max(screenWidth, screenHeight) * 2.5;
  const thickness = 0.003 * maxDimension;

  const color: string = 'rgba(0 0 0 200)';

  const gridComponent = grid.map(([xPosition, yPosition], index) => {
    if (grid.length !== lengths.length) {
      return <></>;
    }
    return (
      <Hair
        key={index}
        tipX={xPosition}
        tipY={yPosition + Math.min(lengths[index], 1000)}
        bottomLeftX={xPosition - thickness / 2}
        bottomLeftY={yPosition}
        bottomRightX={xPosition + thickness / 2}
        bottomRightY={yPosition}
        color={color}
      />
    );
  });
  return <>{gridComponent}</>;
};
