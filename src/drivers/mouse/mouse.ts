import { MouseVelocity } from './mouse-velocity';
import { MouseClickState } from './mouse-click-state';
import { MousePosition } from './mouse-position';

export class Mouse {
  static readonly VELOCITY_SAMPLE_INTERVAL = 50;
  static instance = new Mouse();

  private position: MousePosition = new MousePosition();
  private clickState: MouseClickState = new MouseClickState();
  private velocity: MouseVelocity = new MouseVelocity(this.position.Position.bind(this.position));

  static Position() {
    return this.instance.position.Position();
  }

  static isClicked() {
    return this.instance.clickState.getIsClicked();
  }

  static Velocity() {
    return this.instance.velocity.Velocity();
  }

  static VelocityAngle() {
    return this.instance.velocity.VelocityAngle();
  }

  static Reset() {
    this.instance = new Mouse();
  }
}
