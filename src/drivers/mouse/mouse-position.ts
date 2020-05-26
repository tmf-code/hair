export class MousePosition {
  private position: [number, number];

  constructor() {
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

  Position() {
    return this.position;
  }

  Reset() {
    this.clearEventListeners();
  }

  private clearEventListeners() {
    document.removeEventListener('mousemove', this.eventHandlers['mousemove']);
    document.removeEventListener('touchmove', this.eventHandlers['touchmove']);
  }
}
