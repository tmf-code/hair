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

  getStack(): T[] {
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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const last = this.stack.pop()!;

    if (last.type === 'empty') this.currentSize++;

    this.individualsInStack.add(value[this.indentityKey]);
    this.individualsInStack.delete(last[this.indentityKey]);
    return last;
  }

  addIfUnique(value: T): T | false {
    if (this.individualsInStack.has(value[this.indentityKey])) return false;

    return this.add(value);
  }
}
