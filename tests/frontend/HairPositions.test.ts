import { hairPositions } from '../../src/drivers/HairPositions';

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
});
