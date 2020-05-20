import { createGridWithInputs, CreateGridArgs } from '../../backend/src/create-grid';

describe('Setting up grid', () => {
  let gridArgs: CreateGridArgs = {
    horizontalDesity: 2,
    verticalDensity: 3,
    randomJitterRange: 0,
    minRotationAngle: 0,
    maxRotationAngle: 0,
  };
  afterEach(() => {
    gridArgs = {
      horizontalDesity: 2,
      verticalDensity: 3,
      randomJitterRange: 0,
      minRotationAngle: -90,
      maxRotationAngle: -80,
    };
  });

  test('Grid is the right size', () => {
    expect(createGridWithInputs(gridArgs).grid).toHaveLength(
      gridArgs.horizontalDesity * gridArgs.verticalDensity,
    );
  });

  test('Lengths array is the right length', () => {
    expect(createGridWithInputs(gridArgs).lengths).toHaveLength(
      gridArgs.horizontalDesity * gridArgs.verticalDensity,
    );
  });

  test('Rotations array is the right length', () => {
    expect(createGridWithInputs(gridArgs).rotations).toHaveLength(
      gridArgs.horizontalDesity * gridArgs.verticalDensity,
    );
  });

  test('All lengths are initialised to 0', () => {
    const arrayOfZeros = new Array(gridArgs.horizontalDesity * gridArgs.verticalDensity).fill(0);
    expect(createGridWithInputs(gridArgs).lengths).toEqual(arrayOfZeros);
  });

  test('All rotations are within min and max rotation range', () => {
    let outputRotations = createGridWithInputs(gridArgs).rotations.every((rotation) => {
      return rotation >= gridArgs.minRotationAngle && rotation <= gridArgs.maxRotationAngle;
    });
    expect(outputRotations).toBeTruthy();
  });

  test('Grid positions are within jitter range', () => {
    gridArgs.randomJitterRange = 0.2;
    let gridPositions = createGridWithInputs(gridArgs).grid.every(([xPosition, yPosition]) => {
      return (
        isWithinRange(xPosition, gridArgs.randomJitterRange) &&
        isWithinRange(yPosition, gridArgs.randomJitterRange)
      );
    });
    expect(gridPositions).toBeTruthy();
  });

  test('Grid positions distribute evenly', () => {
    gridArgs.verticalDensity = 2;
    let testGrid = [
      [0, 0],
      [0.5, 0],
      [0, 0.5],
      [0.5, 0.5],
    ];
    expect(createGridWithInputs(gridArgs).grid).toEqual(testGrid);
  });
});

const isWithinRange = (value: number, range: number) => {
  return value >= value - range && value <= value + range;
};
