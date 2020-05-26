import { SampledVelocity } from '../../utilities/sampled-velocity';

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
    return this.sampledVelocity.getVelocity();
  }

  public VelocityAngle() {
    return Math.atan2(...this.sampledVelocity.getVelocity());
  }
}
