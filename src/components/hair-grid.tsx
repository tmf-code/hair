import React from 'react';
import { hairThickness, hairColor } from './constants';

type Vector2 = [number, number];
type Rotations = number[];
type Grid = Vector2[];
type Lengths = number[];

export type HairGridProps = {
  lengths: Lengths;
  rotations: Rotations;
  grid: Grid;
};

export const HairGrid = ({ lengths, rotations, grid }: HairGridProps) => {
  const gridOfHair = grid.map(([xPosition, yPosition], index) => {
    if (grid.length !== lengths.length || grid.length !== rotations.length) {
      return <></>;
    }

    const tipX = xPosition;
    const tipY = yPosition + Math.min(lengths[index], 70);
    const bottomLeftX = xPosition - hairThickness / 2;
    const bottomLeftY = yPosition;
    const bottomRightX = xPosition + hairThickness / 2;
    const bottomRightY = yPosition;
    return (
      <polygon
        transform={`rotate(${rotations[index]} ${(bottomLeftX + bottomRightX) / 2} ${
          (bottomLeftY + bottomRightY) / 2
        })`}
        points={`${tipX},${tipY} ${bottomLeftX},${bottomLeftY} ${bottomRightX},${bottomRightY}`}
        className="triangle"
        fill={hairColor}
      />
    );
  });

  return (
    <svg width={'100%'} height={'100%'}>
      {gridOfHair}
    </svg>
  );
};
