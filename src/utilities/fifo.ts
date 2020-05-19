type IEmpty = {
  type: 'empty' | 'useful';
};

export class FIFO<T extends IEmpty> {
  stack: T[];
  public readonly maxSize: number;
  private currentSize: number;
  private readonly emptyValue: T;
  private readonly identifier: keyof T;

  constructor(maxSize: number, emptyValue: T, identifier: keyof T) {
    this.maxSize = maxSize;
    this.emptyValue = emptyValue;
    this.identifier = identifier;
    this.currentSize = 0;
    this.stack = [...new Array(maxSize)].fill(emptyValue);
  }

  getCurrentSize(): number {
    return this.currentSize;
  }

  /**
   * Adds value to the FIFO stack
   * Adjusts the currentSize field
   * @param value The value to add to the stack
   * @returns The oldest value in the array
   */
  add(value: T): T {
    this.stack.unshift(value);
    const last = this.stack.pop()!;

    if (last.type === 'empty') {
      this.currentSize++;
    }

    return last;
  }

  addReplace(value: T): T {
    const tryGetIndex = this.stack.findIndex(
      (stackedValue) => stackedValue[this.identifier] === value[this.identifier],
    );

    if (tryGetIndex !== -1) {
      this.stack[tryGetIndex] = this.emptyValue;
      this.currentSize--;
    }

    return this.add(value);
  }

  addIfUnique(value: T): T | false {
    if (this.contains(value)) return false;

    return this.add(value);
  }

  contains(value: T): boolean {
    return this.stack.some(
      (stackedValue) => stackedValue[this.identifier] === value[this.identifier],
    );
  }
  /**
   * Removes the last value of the FIFO stack
   * Adds an empty value to make sure the stack is always full
   * Adjusts the currentSize field
   * @returns The oldest value in the array
   */
  remove(): T {
    this.stack.unshift(this.emptyValue);

    const last = this.stack.pop()!;

    if (last.type !== 'empty') {
      this.currentSize--;
    }

    return this.stack.pop()!;
  }
}
