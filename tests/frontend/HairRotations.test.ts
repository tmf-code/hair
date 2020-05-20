import { hairRotations } from '../../src/drivers/HairRotations';

describe('HairRotations initial state', () => {
  test('Initial rotations are empty', () => {
    expect(hairRotations.getRotations()).toStrictEqual([]);
  });
});

describe('HairRotations actions', () => {
  test('Adding rotations updates rotations', () => {
    const givenRotations = [1, 2, 3, 4];

    hairRotations.setRotations(givenRotations);
    expect(hairRotations.getRotations()).toStrictEqual(givenRotations);
  });
});
