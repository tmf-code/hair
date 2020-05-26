import { MouseVelocity } from './mouse-velocity';
import { MouseClickState } from './mouse-click-state';
import { MousePosition } from './mouse-position';

export class Mouse {
  static readonly VELOCITY_SAMPLE_INTERVAL = 50;
  static instance = new Mouse();

  private position: MousePosition = new MousePosition();
  private clickState: MouseClickState = new MouseClickState();
  private velocity: MouseVelocity = new MouseVelocity(
    this.position.getPosition.bind(this.position),
  );

  static getPosition() {
    return this.instance.position.getPosition();
  }

  static isClicked() {
    return this.instance.clickState.getIsClicked();
  }

  static getVelocity() {
    return this.instance.velocity.getVelocity();
  }

  static getVelocityAngle() {
    return this.instance.velocity.getVelocityAngle();
  }

  static reset() {
    this.instance = new Mouse();
  }
}
