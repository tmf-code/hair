import { SampledVelocity } from '../../utilities/sampled-velocity';

export class MouseVelocity {
  private sampledVelocity: SampledVelocity;

  constructor(sampleInterval: number, getMousePosition: () => [number, number]) {
    this.sampledVelocity = new SampledVelocity(sampleInterval, getMousePosition);
  }

  public getVelocity(): [number, number] {
    return this.sampledVelocity.getVelocity();
  }
}
