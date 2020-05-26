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

  public getVelocity() {
    return this.sampledVelocity.getVelocity();
  }

  public getVelocityAngle() {
    return Math.atan2(...this.sampledVelocity.getVelocity());
  }
}
