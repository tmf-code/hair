import { Vector2 } from 'three';

export class Mouse {
  static readonly VELOCITY_SAMPLE_INTERVAL = 50;
  static instance = new Mouse();

  private isClicked = false;
  private position: [number, number];
  private positionVector: Vector2;

  private constructor() {
    this.position = [0, 0];
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
    this.position = this.getPosition(event);
    this.positionVector = new Vector2().fromArray(this.position);
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
