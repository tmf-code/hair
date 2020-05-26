export class MouseClickState {
  private isClicked = false;

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
    mousedown: () => this.handleDragStart(),
    touchstart: () => this.handleDragStart(),
    mouseup: () => this.handleDragEnd(),
    touchend: () => this.handleDragEnd(),
  };

  private handleDragStart = () => (this.isClicked = true);
  private handleDragEnd = () => (this.isClicked = false);

  getIsClicked() {
    return this.isClicked;
  }

  Reset() {
    this.clearEventListeners();
  }

  private clearEventListeners() {
    document.removeEventListener('mousedown', this.eventHandlers['mousedown']);
    document.removeEventListener('mouseup', this.eventHandlers['mouseup']);
    document.removeEventListener('touchstart', this.eventHandlers['touchstart']);
    document.removeEventListener('touchend', this.eventHandlers['touchend']);
  }
}
