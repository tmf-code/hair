import { growthTickInterval, growthPerTick } from './../../utilities/constants';
class HairLengths {
  private lengths: number[];
  private growthIntervalId: number;
  constructor(size: number) {
    const allZeros = [...new Array(size)].fill(0);
    this.lengths = allZeros;

    this.growthIntervalId = window.setInterval(() => {
      requestAnimationFrame(() => this.grow(growthPerTick));
    }, growthTickInterval);
  }

  destroy() {
    clearInterval(this.growthIntervalId);
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
      throw new RangeError(
        `cuts.length should be the same size as this.lengths. Got ${cuts.length}, expected ${
          this.getLengths().length
        }`,
      );

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
