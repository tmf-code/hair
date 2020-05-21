import { hairCuts } from '../../src/drivers/HairCuts';
import { hairLengths } from '../../src/drivers/HairLengths';

describe('HairCuts Initial State', () => {
  test('Does not have pending cuts', () => {
    expect(hairCuts.hasClientCuts()).toBeFalsy();
  });

  test('getBufferAndClear returns empty', () => {
    expect(hairCuts.getBufferAndClear()).toStrictEqual([]);
  });
});

describe('HairCut Actions', () => {
  beforeEach(() => {
    hairCuts.getBufferAndClear();
  });

  test('addFromServer updates hairLengths', () => {
    hairLengths.cutHairs = jest.fn();
    hairCuts.addFromServer([true, false, true]);
    expect(hairLengths.cutHairs).toBeCalledWith([true, false, true]);
  });

  test('addFromClient updates internal lengths and hairLengths', () => {
    hairLengths.cutHairs = jest.fn();
    hairCuts.addFromClient([true, false, true]);

    expect(hairLengths.cutHairs).toBeCalledWith([true, false, true]);

    expect(hairCuts.getBufferAndClear()).toStrictEqual([true, false, true]);
  });

  test('getBufferAndClear clears the internal state', () => {
    hairLengths.cutHairs = jest.fn();
    hairCuts.addFromClient([true, false, true]);

    expect(hairCuts.getBufferAndClear()).toStrictEqual([true, false, true]);
    expect(hairCuts.getBufferAndClear()).toStrictEqual([false, false, false]);
  });
});
