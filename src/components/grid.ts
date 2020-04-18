type Vector = [number, number];

export const Grid = (
  width: number,
  height: number,
  cellWidth: number,
  cellHeight: number,
): Vector[] => {
  const offScreenCells = 1;
  const columns = Math.floor(width / cellWidth) + 2 * offScreenCells;
  const rows = Math.floor(height / cellHeight) + 2 * offScreenCells;

  const gridPositions = [];
  for (let rowIndex = -offScreenCells; rowIndex < rows; rowIndex++) {
    for (let colIndex = -offScreenCells; colIndex < columns; colIndex++) {
      let position: Vector = [colIndex * cellWidth, rowIndex * cellHeight];
      gridPositions.push(position);
    }
  }

  return gridPositions;
};
