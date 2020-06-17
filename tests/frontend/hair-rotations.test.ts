import { HairRotations } from '../../src/drivers/hairs/hair-rotations';

describe('HairRotations initial state', () => {
  test('Initial rotations are empty', () => {
    const hairRotations = new HairRotations(0);
    expect(hairRotations.getRotations()).toStrictEqual([]);
  });
});

describe('HairRotations actions', () => {
  test('Adding initial rotations updates rotations', () => {
    const hairRotations = new HairRotations(4);
    const initialRotations = [1, 2, 3, 4];

    hairRotations.setInitialRotations(initialRotations);
    expect(hairRotations.getRotations()).toStrictEqual(initialRotations);
  });
});
