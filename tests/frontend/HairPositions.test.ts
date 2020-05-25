import { HairPositions } from '../../src/drivers/HairPositions';

const hairPositions = new HairPositions(0);

describe('HairPositions initial state', () => {
  test('Initial positions are empty', () => {
    expect(hairPositions.getPositions()).toStrictEqual([]);
  });
});

describe('HairPositions actions', () => {
  test('Adding positions updates positions', () => {
    const givenPositions = [
      [0, 1],
      [1, 2],
      [3, 4],
    ] as [number, number][];

    hairPositions.setPositions(givenPositions);
    expect(hairPositions.getPositions()).toStrictEqual(givenPositions);
  });

  test('Setting viewport updates relative positions', () => {
    const givenPositions = [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ] as [number, number][];

    const viewportWidth = 1;
    const viewportHeight = 1;

    const expectedPositions = [
      [-0.5, 0.5],
      [-0.5, -0.5],
      [0.5, 0.5],
      [0.5, -0.5],
    ] as [number, number][];

    hairPositions.setPositions(givenPositions);
    hairPositions.setViewport(viewportWidth, viewportHeight);
    expect(hairPositions.getScreenPositions()).toStrictEqual(expectedPositions);
  });
});
