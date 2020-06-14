export class MouseDirection {
  private readonly sampleInterval: number;
  private getMouseVelocity: () => [number, number];
  private interval: number | undefined;

  private targetDirection: number;

  constructor(sampleInterval: number, getMouseVelocity: () => [number, number]) {
    this.sampleInterval = sampleInterval;
    this.getMouseVelocity = getMouseVelocity;

    this.targetDirection = 0;

    this.installInterval();
  }

  private installInterval() {
    this.interval && clearInterval(this.interval);
    this.interval = window.setInterval(this.takeSample.bind(this), this.sampleInterval);
  }

  private takeSample() {
    const mouseVelocity = this.getMouseVelocity();

    if (this.velocityIsZero(mouseVelocity)) return;

    this.targetDirection = Math.atan2(...mouseVelocity);
  }

  private velocityIsZero(velocity: [number, number]) {
    return velocity[0] === 0 && velocity[1] === 0;
  }

  setToVertical(): void {
    this.targetDirection = 0;
  }

  reset(): void {
    this.removeInterval();
  }

  private removeInterval() {
    this.interval && clearInterval(this.interval);
  }

  getDirection(): number {
    return this.targetDirection;
  }
}
