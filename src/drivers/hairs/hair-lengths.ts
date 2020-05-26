class HairLengths {
  private lengths: number[];

  constructor(size: number) {
    const allZeros = [...new Array(size)].fill(0);
    this.lengths = allZeros;
  }

  size() {
    return this.lengths.length;
  }

  grow(growthSpeed: number) {
    for (let lengthIndex = 0; lengthIndex < this.lengths.length; lengthIndex++) {
      const length = this.lengths[lengthIndex];
      this.lengths[lengthIndex] = Math.min(length + growthSpeed, 1);
    }
  }

  cutHairs(cuts: boolean[]) {
    if (cuts.length !== this.getLengths().length)
      throw new RangeError('cuts.length should be the same size as this.lengths');

    for (let lengthIndex = 0; lengthIndex < this.lengths.length; lengthIndex++) {
      const length = this.lengths[lengthIndex];
      const cut = cuts[lengthIndex];
      this.lengths[lengthIndex] = cut ? 0 : length;
    }
  }

  updateLengths(lengths: number[]) {
    this.lengths = lengths;
  }

  getLengths() {
    return this.lengths;
  }
}

export { HairLengths };
