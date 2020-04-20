type MouseListener = (position: [number, number]) => void;

export class Mouse {
  static instance = new Mouse();

  public listeners: Map<string, MouseListener> = new Map();
  public position: [number, number];
  public isClicked: boolean = false;

  private constructor() {
    this.position = [0, 0];
    document.addEventListener('mousemove', (event: MouseEvent) => {
      this.position = [event.clientX, event.clientY];
    });
    document.addEventListener('mousedown', (event: MouseEvent) => {
      this.isClicked = true;
    });
    document.addEventListener('mouseup', (event: MouseEvent) => {
      this.isClicked = false;
    });
    document.addEventListener('touchstart', (event: TouchEvent) => {
      this.isClicked = true;
    });
    document.addEventListener('touchend', (event: TouchEvent) => {
      this.isClicked = false;
    });

    document.addEventListener('touchmove', (event: TouchEvent) => {
      this.position = [event.touches[0].clientX, event.touches[0].clientY];
    });
  }

  static Position(): [number, number] {
    return this.instance.position;
  }

  static isClicked(): boolean {
    return this.instance.isClicked;
  }
}
