import { Hair } from './hair';
import React from 'react';

type Vector2 = [number, number];
type Rotations = number[];
type Grid = Vector2[];
type Lengths = number[];

export type HairGridProps = {
  cutHairs: number[];
  lengths: Lengths;
  rotations: Rotations;
  grid: Grid;
  screenWidth: number;
  screenHeight: number;
};

export const HairGrid = ({
  cutHairs,
  lengths,
  rotations,
  grid,
  screenWidth,
  screenHeight,
}: HairGridProps) => {
  const maxDimension = Math.max(screenWidth, screenHeight) * 2.5;
  const thickness = 0.003 * maxDimension;

  const color: string = 'rgba(0 0 0 200)';

  const gridOfHair = grid.map(([xPosition, yPosition], index) => {
    if (grid.length !== lengths.length || grid.length !== rotations.length) {
      return <></>;
    }
    return (
      <Hair
        key={index}
        rotation={rotations[index]}
        tipX={xPosition}
        tipY={yPosition + Math.min(lengths[index], 70)}
        bottomLeftX={xPosition - thickness / 2}
        bottomLeftY={yPosition}
        bottomRightX={xPosition + thickness / 2}
        bottomRightY={yPosition}
        color={color}
      />
    );
  });

  return <>{gridOfHair}</>;
};
