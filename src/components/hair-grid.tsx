import React from 'react';

type Vector2 = [number, number];
type Rotations = number[];
type Grid = Vector2[];
type Lengths = number[];

export type HairGridProps = {
  lengths: Lengths;
  rotations: Rotations;
  grid: Grid;
  screenWidth: number;
  screenHeight: number;
};

export const HairGrid = ({
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

    const tipX = xPosition;
    const tipY = yPosition + Math.min(lengths[index], 70);
    const bottomLeftX = xPosition - thickness / 2;
    const bottomLeftY = yPosition;
    const bottomRightX = xPosition + thickness / 2;
    const bottomRightY = yPosition;
    return (
      <polygon
        transform={`rotate(${rotations[index]} ${(bottomLeftX + bottomRightX) / 2} ${
          (bottomLeftY + bottomRightY) / 2
        })`}
        points={`${tipX},${tipY} ${bottomLeftX},${bottomLeftY} ${bottomRightX},${bottomRightY}`}
        className="triangle"
        fill={color}
      />
    );
  });

  return (
    <svg width={'100%'} height={'100%'}>
      {gridOfHair}
    </svg>
  );
};
