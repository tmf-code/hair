export class MouseClickState {
  private isClicked = false;

  constructor() {
    this.addEventListeners();
  }

  private addEventListeners() {
    document.addEventListener('mousedown', this.eventHandlers['mousedown']);
    document.addEventListener('mouseup', this.eventHandlers['mouseup']);
  }

  private eventHandlers = {
    mousedown: () => this.handleDragStart(),
    mouseup: () => this.handleDragEnd(),
  };

  private handleDragStart = () => (this.isClicked = true);
  private handleDragEnd = () => (this.isClicked = false);

  getIsClicked() {
    return this.isClicked;
  }

  reset() {
    this.clearEventListeners();
  }

  private clearEventListeners() {
    document.removeEventListener('mousedown', this.eventHandlers['mousedown']);
    document.removeEventListener('mouseup', this.eventHandlers['mouseup']);
  }
}
