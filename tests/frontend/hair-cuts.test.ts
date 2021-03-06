import { HairCuts } from '../../src/drivers/hairs/hair-cuts';

const cutLength = 3;
const allFalse = [...new Array(cutLength)].fill(false);

describe('HairCuts Initial State', () => {
  const hairCuts = new HairCuts(cutLength);

  test('Does not have new cuts', () => {
    expect(hairCuts.hasNewCuts()).toBeFalsy();
  });

  test('Does not have client cuts', () => {
    expect(hairCuts.hasClientCuts()).toBeFalsy();
  });

  test('getNewCuts returns empty', () => {
    expect(hairCuts.getNewCuts()).toStrictEqual(allFalse);
  });

  test('getClientCuts returns empty', () => {
    expect(hairCuts.getClientCuts()).toStrictEqual(allFalse);
  });
});

describe('HairCut Actions', () => {
  let hairCuts = new HairCuts(cutLength);
  beforeEach(() => {
    hairCuts = new HairCuts(cutLength);
  });

  test('clearClientCuts clears client cuts', () => {
    const cutsFirst = [true, false, false];

    hairCuts.addFromClient(cutsFirst);
    hairCuts.clearClientCuts();
    expect(hairCuts.getClientCuts()).toStrictEqual(allFalse);
  });

  test('clearNewCuts clears new cuts', () => {
    const cutsFirst = [true, false, false];

    hairCuts.addFromClient(cutsFirst);
    hairCuts.clearNewCuts();
    expect(hairCuts.getNewCuts()).toStrictEqual(allFalse);
  });

  test('addFromClient updates cuts', () => {
    const cuts = [true, false, true];

    hairCuts.addFromClient(cuts);
    expect(hairCuts.hasNewCuts()).toBeTruthy();
    expect(hairCuts.hasClientCuts()).toBeTruthy();
    expect(hairCuts.getNewCuts()).toStrictEqual(cuts);
  });

  test('addFromClient combines cuts', () => {
    const cutsFirst = [true, false, false];
    const cutsSecond = [false, false, true];
    const cutsExpected = [true, false, true];

    hairCuts.addFromClient(cutsFirst);
    hairCuts.addFromClient(cutsSecond);
    expect(hairCuts.getNewCuts()).toStrictEqual(cutsExpected);
  });
});
