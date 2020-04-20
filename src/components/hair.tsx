import React, { useState } from 'react';

export type HairProps = {
  grow?: boolean;
  fall?: boolean;
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
  fall = false,
  rotation,
  tipX,
  tipY,
  bottomLeftX,
  bottomLeftY,
  bottomRightX,
  bottomRightY,
  color,
}: HairProps) => {
  const [triggerFall, setTriggerFall] = useState<boolean>(false);

  if (fall) {
    setTimeout(() => {
      return setTriggerFall(true);
    }, 100);
  }

  return (
    <svg className={triggerFall ? 'fall' : ''} width="100%" height="100%">
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
