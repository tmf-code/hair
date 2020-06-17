import { HairLengths } from '../../src/drivers/hairs/hair-lengths';

const hairLengths = new HairLengths(0);
describe('HairLength Initial State', () => {
  test('Size should be zero', () => {
    expect(hairLengths.size()).toEqual(0);
  });

  test('Lengths should be an empty array', () => {
    expect(hairLengths.getLengths()).toStrictEqual([]);
  });

  test('Size should be zero', () => {
    expect(hairLengths.size()).toEqual(0);
  });

  test('Grow should do nothing', () => {
    hairLengths.grow(1);
    expect(hairLengths.size()).toEqual(0);
    expect(hairLengths.getLengths()).toStrictEqual([]);
    expect(hairLengths.size()).toEqual(0);
  });

  test('Cut should do nothing', () => {
    hairLengths.cutHairs([]);
    expect(hairLengths.size()).toEqual(0);
    expect(hairLengths.getLengths()).toStrictEqual([]);
    expect(hairLengths.size()).toEqual(0);
  });

  test('Cutting with an incorrect number of hairs should throw ', () => {
    expect(() => hairLengths.cutHairs([true, true, true])).toThrow();
  });
});

describe('HairLength Actions', () => {
  beforeEach(() => {
    hairLengths.updateLengths([]);
  });

  test('Update hair lengths changes hair lengths', () => {
    const data = [1, 2, 3];
    hairLengths.updateLengths(data);
    expect(hairLengths.size()).toEqual(data.length);
    expect(hairLengths.getLengths()).toStrictEqual(data);
  });

  test('Cutting hairs changes the lengths to zero', () => {
    const lengths = [1, 2, 3];
    const cuts = [true, false, true];
    const expected = [0, 2, 0];
    hairLengths.updateLengths(lengths);
    hairLengths.cutHairs(cuts);

    expect(hairLengths.getLengths()).toStrictEqual(expected);
  });

  test('Cutting hairs changes the lengths to zero', () => {
    const lengths = [1, 2, 3];
    const cuts = [true, false, true];
    const expected = [0, 2, 0];
    hairLengths.updateLengths(lengths);
    hairLengths.cutHairs(cuts);

    expect(hairLengths.getLengths()).toStrictEqual(expected);
  });

  test('Growing hairs is capped at length 1', () => {
    const lengths = [1, 2, 3];
    const growthSpeed = 1;
    const expected = [1, 1, 1];

    hairLengths.updateLengths(lengths);
    hairLengths.grow(growthSpeed);

    expect(hairLengths.getLengths()).toStrictEqual(expected);
  });

  test('Growing hairs add length', () => {
    const lengths = [0, 0.1, 0.2];
    const growthSpeed = 0.1;
    const expected = [0.1, 0.2, 0.3];

    hairLengths.updateLengths(lengths);
    hairLengths.grow(growthSpeed);

    expected.forEach((expectedValue, index) => {
      expect(hairLengths.getLengths()[index]).toBeCloseTo(expectedValue, 2);
    });
  });
});
