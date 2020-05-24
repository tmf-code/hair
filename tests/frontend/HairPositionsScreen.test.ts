import { HairPositionsScreen } from '../../src/drivers/HairPositionsScreen';
import { HairPositionsRelative } from '../../src/drivers/HairPositionsRelative';

const hairPositionsScreen = new HairPositionsScreen();
const hairPositionsRelative = new HairPositionsRelative();

describe('HairPositionsScreen initial state', () => {
  test('Initial positions are empty', () => {
    expect(hairPositionsScreen.getPositions()).toStrictEqual([]);
  });
});

describe('HairPositionsScreen actions', () => {
  test('Adding positions updates positions', () => {
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

    hairPositionsRelative.setPositions(givenPositions);
    hairPositionsScreen.setFromRelative(hairPositionsRelative, viewportWidth, viewportHeight);
    expect(hairPositionsScreen.getPositions()).toStrictEqual(expectedPositions);
  });
});
