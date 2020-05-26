import { SampledVelocity } from '../../utilities/sampled-velocity';
import { Vector2 } from 'three';

export class MouseVelocity {
  static readonly VELOCITY_SAMPLE_INTERVAL = 50;

  private sampledVelocity: SampledVelocity;

  constructor(getMousePosition: () => [number, number]) {
    this.sampledVelocity = new SampledVelocity(
      MouseVelocity.VELOCITY_SAMPLE_INTERVAL,
      getMousePosition,
    );
  }

  public Velocity() {
    this.sampledVelocity.getVelocity();
  }

  public VelocityVector() {
    return new Vector2()
      .fromArray(this.sampledVelocity.getVelocity())
      .divideScalar(window.innerWidth);
  }

  public VelocityAngle() {
    return Math.atan2(...this.sampledVelocity.getVelocity());
  }
}
