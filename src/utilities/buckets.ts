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

  getBucket(value: number) {
    return Math.floor(((value - this.min) / (this.max - this.min)) * this.numBuckets);
  }

  getCountOfBucketAtValue(value: number) {
    const bucket = this.getBucket(value);
    return this.getCountOfBucket(bucket);
  }

  getCountOfBucket(bucket: number) {
    return this.counts[bucket];
  }

  add(value: number) {
    const bucket = this.getBucket(value);
    this.counts[bucket] += 1;
  }

  remove(value: number) {
    const bucket = this.getBucket(value);
    this.counts[bucket] -= 1;
  }
}
