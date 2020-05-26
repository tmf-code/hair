import { SampledVelocity } from './SampledVelocity';
import { Vector2 } from 'three';

export class MouseVelocity {
  static readonly VELOCITY_SAMPLE_INTERVAL = 50;
  static instance = new MouseVelocity();

  private position: [number, number];

  private static sampledVelocity: SampledVelocity = new SampledVelocity(
    MouseVelocity.VELOCITY_SAMPLE_INTERVAL,
    MouseVelocity.Position.bind(MouseVelocity),
  );

  private constructor() {
    this.position = [0, 0];
    this.addEventListeners();
  }

  private addEventListeners() {
    document.addEventListener('mousemove', this.eventHandlers['mousemove']);
    document.addEventListener('touchmove', this.eventHandlers['touchmove']);
  }

  private eventHandlers = {
    mousemove: (event: MouseEvent) => this.handleMove(event),
    touchmove: (event: TouchEvent) => this.handleMove(event),
  };

  private handleMove(event: TouchEvent | MouseEvent) {
    this.position = this.getPosition(event);
  }

  private getPosition(event: TouchEvent | MouseEvent): [number, number] {
    if (this.isTouchEvent(event)) return [event.touches[0].clientX, event.touches[0].clientY];

    return [event.clientX, event.clientY];
  }

  private isTouchEvent = (event: TouchEvent | MouseEvent): event is TouchEvent =>
    (event as TouchEvent).touches !== undefined;

  private static Position() {
    return this.instance.position;
  }

  static VelocityVector() {
    return new Vector2()
      .fromArray(this.sampledVelocity.getVelocity())
      .divideScalar(window.innerWidth);
  }

  static VelocityAngle() {
    return Math.atan2(...this.sampledVelocity.getVelocity());
  }

  static Reset() {
    this.instance.clearEventListeners();
    this.instance = new MouseVelocity();
  }

  private clearEventListeners() {
    document.removeEventListener('mousemove', this.eventHandlers['mousemove']);
    document.removeEventListener('touchmove', this.eventHandlers['touchmove']);
  }
}
