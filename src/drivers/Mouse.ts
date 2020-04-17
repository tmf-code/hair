type MouseListener = (position: [number, number]) => void;

export class Mouse {
  static instance = new Mouse();

  public listeners: Map<string, MouseListener> = new Map();
  public position: [number, number];

  private constructor() {
    this.position = [0, 0];
    document.addEventListener('mousemove', (event: MouseEvent) => {
      this.position = [event.clientX, event.clientY];
      this.updateListeners(this.position);
    });

    document.addEventListener('touchmove', (event: TouchEvent) => {
      this.position = [event.touches[0].clientX, event.touches[0].clientY];
      this.updateListeners(this.position);
    });
  }

  private updateListeners(position: [number, number]) {
    this.listeners.forEach((listener) => listener(position));
  }
  static Position(): [number, number] {
    return this.instance.position;
  }

  static addListener(name: string, listener: MouseListener) {
    if (this.instance.listeners.has(name)) {
      return;
    }
    this.instance.listeners.set(name, listener);
  }
}
