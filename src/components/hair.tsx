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
    <div className="triangle-container">
      <svg width="100%" height="100vh">
        <polygon
          points={`${tipX},${tipY} ${bottomLeftX},${bottomLeftY} ${bottomRightX},${bottomRightY}`}
          className="triangle"
          fill={color}
        />
      </svg>
    </div>
  );
};
