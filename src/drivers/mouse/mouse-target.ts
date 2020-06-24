export class MouseTarget {
  private currentTarget = '';

  constructor() {
    this.addEventListeners();
  }

  private addEventListeners() {
    document.addEventListener('mousedown', this.eventHandlers['mousedown']);
    document.addEventListener('mouseup', this.eventHandlers['mouseup']);
    document.addEventListener('touchstart', this.eventHandlers['touchstart']);
    document.addEventListener('touchend', this.eventHandlers['touchend']);
  }

  private eventHandlers = {
    mousedown: (event: MouseEvent) => this.handleDragStart(event),
    mouseup: (event: MouseEvent) => this.handleDragEnd(event),
    touchstart: (event: TouchEvent) => this.handleTouchStart(event),
    touchend: (event: TouchEvent) => this.handleTouchEnd(event),
  };

  private handleDragStart = (event: MouseEvent) =>
    (this.currentTarget = this.getTagNameFromEvent(event));
  private handleDragEnd = (event: MouseEvent) =>
    (this.currentTarget = this.getTagNameFromEvent(event));
  private handleTouchStart = (event: TouchEvent) =>
    (this.currentTarget = this.getTagNameFromEvent(event));
  private handleTouchEnd = (event: TouchEvent) =>
    (this.currentTarget = this.getTagNameFromEvent(event));

  getTarget(): string {
    return this.currentTarget;
  }

  reset(): void {
    this.clearEventListeners();
  }

  private getTagNameFromEvent(event: MouseEvent | TouchEvent) {
    if (!event.target) return '';
    return (event.target as HTMLElement).tagName;
  }

  private clearEventListeners() {
    document.removeEventListener('mousedown', this.eventHandlers['mousedown']);
    document.removeEventListener('mouseup', this.eventHandlers['mouseup']);
    document.removeEventListener('touchstart', this.eventHandlers['touchstart']);
    document.removeEventListener('touchend', this.eventHandlers['touchend']);
  }
}
