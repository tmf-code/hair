export class SampledVelocity {
  private readonly sampleInterval: number;
  private getPosition: () => [number, number];
  private velocity: [number, number];
  private lastPosition: [number, number];
  private interval: number | undefined;

  constructor(sampleInterval: number, getPosition: () => [number, number]) {
    this.sampleInterval = sampleInterval;
    this.getPosition = getPosition;

    this.velocity = [0, 0];
    this.lastPosition = [0, 0];

    this.installInterval();
  }

  private installInterval() {
    this.interval && clearInterval(this.interval);
    this.interval = window.setInterval(this.takeSample.bind(this), this.sampleInterval);
  }

  private takeSample() {
    const mousePosition = this.getPosition();

    const distance = [
      mousePosition[0] - this.lastPosition[0],
      mousePosition[1] - this.lastPosition[1],
    ];

    this.lastPosition = mousePosition;
    this.velocity = [distance[0] / this.sampleInterval, distance[1] / this.sampleInterval];
  }

  getVelocity = () => [...this.velocity];
  clear = () => this.removeInterval();

  private removeInterval() {
    this.interval && clearInterval(this.interval);
  }
}
