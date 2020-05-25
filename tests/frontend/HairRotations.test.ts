import { HairRotations } from '../../src/drivers/HairRotations';

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

  test('Adding offset rotations updates rotations', () => {
    const hairRotations = new HairRotations(4);
    const initialRotations = [1, 2, 3, 4];
    const offsets = [1, 2, 3, 4];

    hairRotations.setInitialRotations(initialRotations);
    hairRotations.setRotationOffsets(offsets);
    expect(hairRotations.getRotations()).toStrictEqual(sumArrays(initialRotations, offsets));
  });
});

const sumArrays = (arrayA: number[], arrayB: number[]) =>
  arrayA.map((value: number, index: number) => value + arrayB[index]);
