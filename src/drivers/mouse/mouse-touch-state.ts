export class MouseTouchState {
  private numberOfTouches = 0;
  private isSingleTouched = false;
  private isDoubleTouched = false;

  constructor() {
    this.addEventListeners();
  }

  private addEventListeners() {
    document.addEventListener('touchstart', this.eventHandlers['touchstart']);
    document.addEventListener('touchend', this.eventHandlers['touchend']);
  }

  private eventHandlers = {
    touchstart: (touchEvent: TouchEvent) => this.handleTouchStart(touchEvent),
    touchend: (touchEvent: TouchEvent) => this.handleTouchEnd(touchEvent),
  };

  private handleTouchStart = (touchEvent: TouchEvent) => {
    this.numberOfTouches = touchEvent.touches.length;
    if (this.numberOfTouches === 1) this.isSingleTouched = true;
    if (this.numberOfTouches === 2) {
      this.isDoubleTouched = true;
      this.isSingleTouched = false;
    }
  };
  private handleTouchEnd = (touchEvent: TouchEvent) => {
    this.numberOfTouches = touchEvent.touches.length;
    if (this.numberOfTouches !== 2) {
      this.isDoubleTouched = false;
      if (this.numberOfTouches === 1) this.isSingleTouched = true;
    }
    if (this.numberOfTouches !== 1) this.isSingleTouched = false;
  };

  getIsSingleTouched(): boolean {
    return this.isSingleTouched;
  }

  getIsDoubleTouched(): boolean {
    return this.isDoubleTouched;
  }

  getNumberOfTouches(): number {
    return this.numberOfTouches;
  }

  reset(): void {
    this.clearEventListeners();
  }

  private clearEventListeners() {
    document.removeEventListener('touchstart', this.eventHandlers['touchstart']);
    document.removeEventListener('touchend', this.eventHandlers['touchend']);
  }
}
