import React from 'react';

export type HairProps = {
  rotation: number;
  tipX: number;
  tipY: number;
  bottomLeftX: number;
  bottomLeftY: number;
  bottomRightX: number;
  bottomRightY: number;
  color: string;
};

export const Hair = ({
  rotation,
  tipX,
  tipY,
  bottomLeftX,
  bottomLeftY,
  bottomRightX,
  bottomRightY,
  color,
}: HairProps) => {
  return (
    <svg width="100%" height="100%">
      <polygon
        transform={`rotate(${rotation} ${(bottomLeftX + bottomRightX) / 2} ${
          (bottomLeftY + bottomRightY) / 2
        })`}
        points={`${tipX},${tipY} ${bottomLeftX},${bottomLeftY} ${bottomRightX},${bottomRightY}`}
        className="triangle"
        fill={color}
      />
    </svg>
  );
};
