import React from 'react';

export type HairProps = {
  tipX: number;
  tipY: number;
  color: string;
};

export const Hair = ({ tipX, tipY, color }: HairProps) => {
  return (
    <div className="triangle-container">
      <svg width="100%" height="100vh">
        <polygon
          points={`${tipX},${tipY} 0,${window.innerHeight} ${window.innerWidth},${window.innerHeight}`}
          className="triangle"
          fill={color}
        />
      </svg>
    </div>
  );
};
