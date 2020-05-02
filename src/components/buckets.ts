export class Buckets {
  public readonly numBuckets: number;
  private counts: number[];
  public readonly min: number;
  public readonly max: number;
  constructor(numBuckets: number, min: number, max: number) {
    this.numBuckets = numBuckets;
    this.min = min;
    this.max = max;
    this.counts = [...new Array(numBuckets)].map(() => 0);
  }

  getCounts(): number[] {
    return this.counts;
  }

  add(value: number): number {
    const bucket = Math.floor(((value - this.min) / (this.max - this.min)) * this.numBuckets);
    this.counts[bucket] += 1;

    return this.counts[bucket];
  }

  remove(value: number) {
    const bucket = Math.floor(((value - this.min) / (this.max - this.min)) * this.numBuckets);
    this.counts[bucket] -= 1;

    return this.counts[bucket];
  }
}
