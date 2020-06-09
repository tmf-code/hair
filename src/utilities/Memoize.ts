type Primitives = string | number | boolean;
type SupportedArgumentTypes = Primitives[];
type SupportedReturnTypes = string[] | number[] | boolean[] | string | boolean | number;
type SupportedFunctions = (...args: SupportedArgumentTypes) => SupportedReturnTypes;

type ThreeDimensionalRecord<T> = Record<number, Record<number, T>>;

export class Memoize {
  static readonly memoizedFunctions: SupportedFunctions[] = [];
  private static readonly memoizedArgs: Record<number, SupportedArgumentTypes[]> = {};
  private static readonly memoizedResults: ThreeDimensionalRecord<SupportedReturnTypes> = {};

  static memoize<
    TFunctionArguments extends SupportedArgumentTypes,
    TFunctionReturns extends SupportedReturnTypes
  >(
    func: (...args: TFunctionArguments) => TFunctionReturns,
    ...callingArguments: TFunctionArguments
  ): TFunctionReturns {
    const functionIndex = Memoize.createOrRecallFunctionIndex(
      (func as unknown) as SupportedFunctions,
    );
    const existingArguments = Memoize.createOrRecallArguments(functionIndex);

    const argumentIndex = Memoize.createOrRecallArgumentIndex(
      existingArguments,
      callingArguments,
      functionIndex,
    );

    const existingResults = Memoize.createOrRecallResults(functionIndex);

    const result = Memoize.createOrRecallResult(
      existingResults,
      argumentIndex,
      functionIndex,
      callingArguments,
      (func as unknown) as SupportedFunctions,
    );

    return result as TFunctionReturns;
  }

  private static createOrRecallFunctionIndex = (func: SupportedFunctions) => {
    const maybeFunctionIndex = Memoize.tryGetIndexOfMemoizedFunction(func);

    if (maybeFunctionIndex !== undefined) return maybeFunctionIndex;

    Memoize.memoizedFunctions.push((func as unknown) as SupportedFunctions);
    return Memoize.memoizedFunctions.length - 1;
  };

  private static createOrRecallArguments = (functionIndex: number) => {
    const maybeArguments = Memoize.tryGetMemoizedArguments(functionIndex);

    if (maybeArguments !== undefined) return maybeArguments;

    Memoize.memoizedArgs[functionIndex] = [];
    return Memoize.memoizedArgs[functionIndex];
  };

  private static createOrRecallArgumentIndex = (
    existingArguments: SupportedArgumentTypes[],
    callingArguments: SupportedArgumentTypes,
    functionIndex: number,
  ) => {
    const maybeArgumentIndex = Memoize.tryGetIndexOfMemoizedArguments(
      existingArguments,
      callingArguments,
    );

    if (maybeArgumentIndex !== undefined) return maybeArgumentIndex;

    Memoize.memoizedArgs[functionIndex].push(callingArguments);
    return Memoize.memoizedArgs[functionIndex].length - 1;
  };

  private static createOrRecallResults = (functionIndex: number) => {
    const maybeResults = Memoize.tryGetResults(functionIndex);

    if (maybeResults !== undefined) return maybeResults;

    Memoize.memoizedResults[functionIndex] = {};
    return Memoize.memoizedResults[functionIndex];
  };

  private static createOrRecallResult = (
    existingResults: Record<number, SupportedReturnTypes>,
    argumentIndex: number,
    functionIndex: number,
    callingArguments: SupportedArgumentTypes,
    func: SupportedFunctions,
  ) => {
    const maybeResult = Memoize.tryGetResult(existingResults, argumentIndex);

    if (maybeResult === undefined) {
      Memoize.memoizedResults[functionIndex][argumentIndex] = func(...callingArguments);
      return Memoize.memoize(func, ...callingArguments);
    }

    return maybeResult;
  };

  private static tryGetIndexOfMemoizedFunction(func: SupportedFunctions): number | undefined {
    const maybeIndex = Memoize.memoizedFunctions.findIndex(Memoize.functionEqualityPredicate(func));
    if (maybeIndex === -1) return undefined;

    return maybeIndex;
  }

  private static tryGetIndexOfMemoizedArguments(
    existingArguments: SupportedArgumentTypes[],
    args: SupportedArgumentTypes,
  ): number | undefined {
    const maybeIndex = existingArguments.findIndex(Memoize.argsEqualityPredicate(args));
    if (maybeIndex === -1) return undefined;

    return maybeIndex;
  }

  private static tryGetMemoizedArguments = (
    functionIndex: number,
  ): SupportedArgumentTypes[] | undefined => Memoize.memoizedArgs[functionIndex];

  private static tryGetResults = (
    functionIndex: number,
  ): Record<number, SupportedReturnTypes> | undefined => Memoize.memoizedResults[functionIndex];

  private static tryGetResult = (
    results: Record<number, SupportedReturnTypes>,
    argumentIndex: number,
  ): SupportedReturnTypes | undefined => results[argumentIndex];

  private static functionEqualityPredicate = (testFunction: SupportedFunctions) => (
    existingFunction: SupportedFunctions,
  ) => testFunction === existingFunction;

  private static argsEqualityPredicate = (testArgs: SupportedArgumentTypes) => (
    existingArgs: SupportedArgumentTypes,
  ) => Memoize.arrayEqual(testArgs, existingArgs);

  private static arrayEqual = (array1: SupportedArgumentTypes, array2: SupportedArgumentTypes) =>
    array2.every((element, index) => array1[index] === element);
}
