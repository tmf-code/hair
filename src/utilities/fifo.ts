import { filterOnce } from './filter-once';

type IEmpty = {
  type: 'empty' | 'useful';
};

export class FIFO<T extends IEmpty, I extends keyof T> {
  private stack: T[];
  public readonly maxSize: number;
  private currentSize: number;
  private readonly indentityKey: I;
  individualsInStack: Set<T[I]>;

  constructor(maxSize: number, emptyValue: T, indentityKey: I) {
    this.maxSize = maxSize;
    this.indentityKey = indentityKey;
    this.currentSize = 0;
    this.stack = [...new Array(maxSize)].fill(emptyValue);
    this.individualsInStack = new Set<T[I]>();
  }

  getCurrentSize(): number {
    return this.currentSize;
  }

  getStack() {
    return this.stack;
  }

  /**
   * Adds value to the FIFO stack
   * Adjusts the currentSize field
   * @param value The value to add to the stack
   * @returns The oldest value in the array
   */
  private add(value: T): T {
    this.stack.unshift(value);
    this.individualsInStack.add(value[this.indentityKey]);
    const last = this.stack.pop()!;

    if (last.type === 'empty') this.currentSize++;

    this.individualsInStack.delete(last[this.indentityKey]);

    return last;
  }

  addIfUnique(value: T): T | false {
    if (this.contains(value)) return false;

    return this.add(value);
  }

  // 122.9ms
  private contains(value: T): boolean {
    return this.stack.some(
      (stackedValue) => stackedValue[this.indentityKey] === value[this.indentityKey],
    );
  }

  private comparator = (valueA: T, valueB: T) =>
    valueA[this.indentityKey] === valueB[this.indentityKey];

  private constainsMany(values: T[]): boolean[] {
    const results: boolean[] = [];

    let remainingToSearch = values;

    for (let index = 0; index < this.stack.length; index++) {
      const existingValue = this.stack[index];
      const lengthBeforeFilter = remainingToSearch.length;
      remainingToSearch = filterOnce(existingValue, values, this.comparator.bind(this));
      const lengthAfterFilter = remainingToSearch.length;

      const doesContain = lengthBeforeFilter !== lengthAfterFilter;
      results.push(doesContain);

      const noMoreToSearch = lengthAfterFilter === 0;
      if (noMoreToSearch) break;
    }

    return results;
  }
}
