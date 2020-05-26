import { Vector2 } from 'three';
import { SmoothlyCircularAverage } from '../utilities/SmoothlyCircularAverage';

export class Mouse {
  private static readonly ZERO_VELOCITY = new Vector2(0, 0);
  static instance = new Mouse();

  private readonly smoothedAngle = new SmoothlyCircularAverage(100, 0);
  private isClicked = false;
  private isMoving = false;
  private position: [number, number];
  private velocityVector: Vector2;
  private positionVector: Vector2;
  private timeout: number | undefined;

  private constructor() {
    this.position = [0, 0];
    this.velocityVector = new Vector2().set(this.position[0], this.position[1]);
    this.positionVector = new Vector2().set(this.position[0], this.position[1]);

    this.addEventListeners();
  }

  private addEventListeners() {
    document.addEventListener('mousemove', this.eventHandlers['mousemove']);
    document.addEventListener('mousedown', this.eventHandlers['mousedown']);
    document.addEventListener('mouseup', this.eventHandlers['mouseup']);
    document.addEventListener('touchstart', this.eventHandlers['touchstart']);
    document.addEventListener('touchend', this.eventHandlers['touchend']);
    document.addEventListener('touchmove', this.eventHandlers['touchmove']);
  }

  private eventHandlers = {
    mousemove: (event: MouseEvent) => this.handleMove(event),
    touchmove: (event: TouchEvent) => this.handleMove(event),
    mousedown: () => this.handleDragStart(),
    touchstart: () => this.handleDragStart(),
    mouseup: () => this.handleDragEnd(),
    touchend: () => this.handleDragEnd(),
  };

  private handleMove(event: TouchEvent | MouseEvent) {
    const prevPosition = this.positionVector.clone();
    this.position = this.getPosition(event);
    this.positionVector = new Vector2().fromArray(this.position);
    this.velocityVector = this.positionVector.clone().sub(prevPosition);
    this.smoothedAngle.addSample(Math.atan2(this.velocityVector.x, this.velocityVector.y));
    this.timeout && clearTimeout(this.timeout);
    this.timeout = window.setTimeout(() => (this.isMoving = false), 20);
    this.isMoving = true;
  }

  private getPosition(event: TouchEvent | MouseEvent): [number, number] {
    if (this.isTouchEvent(event)) return [event.touches[0].clientX, event.touches[0].clientY];

    return [event.clientX, event.clientY];
  }

  private isTouchEvent = (event: TouchEvent | MouseEvent): event is TouchEvent =>
    (event as TouchEvent).touches !== undefined;

  private handleDragStart = () => (this.isClicked = true);
  private handleDragEnd = () => (this.isClicked = false);

  static Position() {
    return this.instance.position;
  }

  static isClicked() {
    return this.instance.isClicked;
  }

  static PositionVector() {
    return this.instance.positionVector.clone();
  }

  static VelocityVector() {
    if (!this.instance.isMoving) return this.ZERO_VELOCITY;

    return this.instance.velocityVector.clone().divideScalar(window.innerWidth);
  }

  static SmoothedAngle() {
    return this.instance.smoothedAngle.getSmoothed();
  }

  static Reset() {
    this.instance.clearEventListeners();
    this.instance = new Mouse();
  }

  private clearEventListeners() {
    document.removeEventListener('mousemove', this.eventHandlers['mousemove']);
    document.removeEventListener('mousedown', this.eventHandlers['mousedown']);
    document.removeEventListener('mouseup', this.eventHandlers['mouseup']);
    document.removeEventListener('touchstart', this.eventHandlers['touchstart']);
    document.removeEventListener('touchend', this.eventHandlers['touchend']);
    document.removeEventListener('touchmove', this.eventHandlers['touchmove']);
  }
}
