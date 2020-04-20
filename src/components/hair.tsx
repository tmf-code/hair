import React, { useState, useRef, useEffect } from 'react';

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

  // Here's how we'll keep track of our component's mounted state
  const componentIsMounted = useRef(true);
  useEffect(() => {
    return () => {
      componentIsMounted.current = false;
    };
  }, []); // Using an empty dependency array ensures this only runs on unmount

  if (fall) {
    requestAnimationFrame(() => componentIsMounted.current && setTriggerFall(true));
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
