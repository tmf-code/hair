import { Memoize } from './../../src/utilities/Memoize';

describe('Memoize runs', () => {
  const add = (a: number, b: number) => a + b;
  const concat = (a: string, b: string) => a + b;
  const concatDifferentTypes = (a: string, b: number) => a + b;
  const arrayOfLength = (a: number) => new Array(a);
  test('Should add primitives', () => {
    expect(Memoize.memoize(add, 1, 2)).toEqual(3);
  });

  test('Should concat strings', () => {
    expect(Memoize.memoize(concat, 'abc', 'def')).toStrictEqual('abcdef');
  });

  test('Should concat different type primitives', () => {
    expect(Memoize.memoize(concatDifferentTypes, 'abc', 1)).toStrictEqual('abc1');
  });

  test('Should return same reference on multiple goes', () => {
    const firstGo = Memoize.memoize(arrayOfLength, 5);
    const secondGo = Memoize.memoize(arrayOfLength, 5);
    expect(firstGo).toBe(secondGo);
    expect(firstGo).not.toBe(new Array(5));
  });

  test('Function should only run once', () => {
    const dummyFunction = jest.fn((a: number) => a);
    Memoize.memoize(dummyFunction, 1);
    Memoize.memoize(dummyFunction, 1);
    Memoize.memoize(dummyFunction, 1);
    expect(dummyFunction).toBeCalledTimes(1);
  });
});
