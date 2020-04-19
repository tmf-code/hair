import React from 'react';

export type HairProps = {
  tipX: number;
  tipY: number;
  bottomLeftX: number;
  bottomLeftY: number;
  bottomRightX: number;
  bottomRightY: number;
  color: string;
};

export const Hair = ({
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
        points={`${tipX},${tipY} ${bottomLeftX},${bottomLeftY} ${bottomRightX},${bottomRightY}`}
        className="triangle"
        fill={color}
      />
    </svg>
  );
};
