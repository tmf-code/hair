class HairLengths {
  private lengths: number[] = [];

  constructor(lengths: number[]) {
    this.lengths = lengths;
  }

  size() {
    return this.lengths.length;
  }
  grow(growthSpeed: number) {
    this.lengths = this.lengths.map((length) => Math.min(length + growthSpeed, 1));
  }
  cutHairs(cuts: boolean[]) {
    if (cuts.length !== this.getLengths().length)
      throw new RangeError('cuts.length should be the same size as this.lengths');

    this.lengths = this.lengths.map((length, lengthIndex) => (cuts[lengthIndex] ? 0 : length));
  }

  updateLengths(lengths: number[]) {
    this.lengths = lengths;
  }
  getLengths() {
    return this.lengths;
  }
}

export { HairLengths };
