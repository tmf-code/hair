import { Vector2 } from 'three';
type MouseListener = (position: [number, number]) => void;

export class Mouse {
  static instance = new Mouse();

  public listeners: Map<string, MouseListener> = new Map();
  public position: [number, number];
  public isClicked: boolean = false;
  private velocityVector: Vector2;
  private positionVector: Vector2;
  private timeout: NodeJS.Timeout | undefined;

  private constructor() {
    this.position = [0, 0];
    this.velocityVector = new Vector2().set(this.position[0], this.position[1]);
    this.positionVector = new Vector2().set(this.position[0], this.position[1]);

    document.addEventListener('mousemove', (event: MouseEvent) => {
      const prevPosition = this.positionVector.clone();
      this.position = [event.clientX, event.clientY];

      this.positionVector = new Vector2().set(this.position[0], this.position[1]);

      this.velocityVector = this.positionVector.clone().sub(prevPosition);
      this.timeout && clearTimeout(this.timeout);
      this.timeout = setTimeout(() => (this.velocityVector = new Vector2().set(0, 0)), 20);
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
      const prevPosition = this.positionVector.clone();

      this.position = [event.touches[0].clientX, event.touches[0].clientY];
      this.positionVector = new Vector2().set(this.position[0], this.position[1]);

      this.velocityVector = this.positionVector.clone().sub(prevPosition);
      this.timeout && clearTimeout(this.timeout);
      this.timeout = setTimeout(() => (this.velocityVector = new Vector2().set(0, 0)), 20);
    });
  }

  static Position(): [number, number] {
    return this.instance.position;
  }

  static isClicked(): boolean {
    return this.instance.isClicked;
  }

  static PositionVector(): Vector2 {
    return this.instance.positionVector.clone();
  }

  static VelocityVector(): Vector2 {
    return this.instance.velocityVector.clone().divideScalar(window.innerWidth);
  }
}
