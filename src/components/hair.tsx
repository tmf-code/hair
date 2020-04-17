export type HairProps = {
  tipX: number;
  tipY: number;
};

export const Hair = ({ tipX, tipY }: HairProps): React.ReactElement<HairProps> => {
  return (
    <div className="triangle-container">
      <svg viewBox="0 0 100 100">
        <polygon points={`${tipX},${tipY} 0,100 100,100`} className="triangle" />
      </svg>
    </div>
  );
};
