import { lerp, clamp } from './utilities';

export class SmoothlyCircularAverage {
  private readonly numberSamples: number;
  private circleAt: number;
  private samples: number[];
  private currentValue: number;

  constructor(samples: number, startingValue: number, circleAt: number = Math.PI * 2) {
    this.numberSamples = samples;
    this.samples = [...new Array(this.numberSamples)].fill(startingValue);
    this.circleAt = circleAt;
    this.currentValue = startingValue;
  }

  addSample(sample: number) {
    this.currentValue = this.getCurrentValue();
    const closest = this.lerpTheta(this.currentValue, sample, 1.0);

    this.samples.unshift(closest);
    this.samples.pop();

    this.currentValue = this.getCurrentValue();
  }

  private removeLoops = (distance: number) =>
    clamp(distance - Math.floor(distance / this.circleAt) * this.circleAt, 0, this.circleAt);

  private lerpTheta(current: number, target: number, interpolation: number) {
    const distance = target - current;
    const unloopedDistance = this.removeLoops(distance);
    const isLeft = unloopedDistance > Math.PI;
    const offset = isLeft ? unloopedDistance - Math.PI * 2 : unloopedDistance;
    return lerp(current, current + offset, interpolation);
  }

  private getCurrentValue() {
    return this.samples.reduce(
      (accumulator, currentValue, _, array) => accumulator + currentValue / array.length,
      0,
    );
  }

  getSmoothed() {
    return this.currentValue;
  }
}
