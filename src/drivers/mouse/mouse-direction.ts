import { lerpTheta } from './../../utilities/utilities';
export class MouseDirection {
  private readonly sampleInterval: number;
  private getMouseVelocity: () => [number, number];
  private interval: number | undefined;

  private targetDirection: number;
  private currentDirection: number;
  private shouldAnimate: boolean;
  private readonly lerpSteps: number;

  constructor(sampleInterval: number, getMouseVelocity: () => [number, number], lerpSteps: number) {
    this.sampleInterval = sampleInterval;
    this.getMouseVelocity = getMouseVelocity;
    this.lerpSteps = lerpSteps;

    this.targetDirection = 0;
    this.currentDirection = 0;
    this.shouldAnimate = true;

    this.installInterval();

    this.startAnimating();
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

  private startAnimating() {
    this.shouldAnimate = true;
    this.animate(Date.now(), Date.now());
  }

  private animate(currentTime: number, lastFrameTime: number) {
    const deltaTime = currentTime - lastFrameTime;

    this.currentDirection = lerpTheta(
      this.currentDirection,
      this.targetDirection,
      0.01 * deltaTime,
      Math.PI * 2,
    );

    if (this.shouldAnimate) {
      requestAnimationFrame((time) => this.animate(time, currentTime));
    }
  }

  setToVertical() {
    this.currentDirection = 0;
    this.targetDirection = 0;
  }

  reset = () => {
    this.stopAnimating();
    this.removeInterval();
  };

  private stopAnimating() {
    this.shouldAnimate = false;
  }

  private removeInterval() {
    this.interval && clearInterval(this.interval);
  }

  getDirection = () => this.targetDirection;
  getSmoothedDirection = () => this.currentDirection;
}
