class HairLengths {
  private lengths: number[] = [];
  size() {
    return this.lengths.length;
  }
  grow(growthSpeed: number) {
    this.lengths = this.lengths.map((length) => Math.min(length + growthSpeed, 1));
  }
  cutHairs(cuts: boolean[]) {
    this.lengths = this.lengths.map((length, lengthIndex) => (cuts[lengthIndex] ? 0 : length));
  }
  updateLengths(lengths: number[]) {
    this.lengths = lengths;
  }
  getLengths() {
    return this.lengths;
  }
}

const hairLengths = new HairLengths();

export { hairLengths };
