import { Vector2 } from 'three';

export class MousePosition {
  private position: [number, number];
  private positionVector: Vector2;

  constructor() {
    this.position = [0, 0];
    this.positionVector = new Vector2().set(this.position[0], this.position[1]);
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
    this.positionVector = new Vector2().fromArray(this.position);
  }

  private getPosition(event: TouchEvent | MouseEvent): [number, number] {
    if (this.isTouchEvent(event)) return [event.touches[0].clientX, event.touches[0].clientY];

    return [event.clientX, event.clientY];
  }

  private isTouchEvent = (event: TouchEvent | MouseEvent): event is TouchEvent =>
    (event as TouchEvent).touches !== undefined;

  Position() {
    return this.position;
  }

  PositionVector() {
    return this.positionVector.clone();
  }

  Reset() {
    this.clearEventListeners();
  }

  private clearEventListeners() {
    document.removeEventListener('mousemove', this.eventHandlers['mousemove']);
    document.removeEventListener('touchmove', this.eventHandlers['touchmove']);
  }
}
