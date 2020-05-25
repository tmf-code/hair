import { Vector2 } from 'three';
import { SmoothlyCircularAverage } from '../utilities/SmoothlyCircularAverage';
type MouseListener = (position: [number, number]) => void;

export class Mouse {
  static instance = new Mouse();

  public listeners: Map<string, MouseListener> = new Map();
  public position: [number, number];
  public isClicked = false;
  private isMoving = false;
  private velocityVector: Vector2;
  private positionVector: Vector2;
  private timeout: number | undefined;

  private smoothedAngle = new SmoothlyCircularAverage(50, 0);

  private eventHandlers = {
    mousemove: (event: MouseEvent) => {
      const prevPosition = this.positionVector.clone();
      this.position = [event.clientX, event.clientY];

      this.positionVector = new Vector2().set(this.position[0], this.position[1]);

      this.velocityVector = this.positionVector.clone().sub(prevPosition);

      this.smoothedAngle.addSample(Math.atan2(this.velocityVector.x, this.velocityVector.y));

      this.timeout && clearTimeout(this.timeout);
      this.timeout = window.setTimeout(() => (this.isMoving = false), 20);
      this.isMoving = true;
    },

    mousedown: () => {
      this.isClicked = true;
    },

    mouseup: () => {
      this.isClicked = false;
    },

    touchstart: () => {
      this.isClicked = true;
    },

    touchend: () => {
      this.isClicked = false;
    },

    touchmove: (event: TouchEvent) => {
      const prevPosition = this.positionVector.clone();

      this.position = [event.touches[0].clientX, event.touches[0].clientY];
      this.positionVector = new Vector2().set(this.position[0], this.position[1]);

      this.velocityVector = this.positionVector.clone().sub(prevPosition);

      this.smoothedAngle.addSample(Math.atan2(this.velocityVector.y, this.velocityVector.x));

      this.timeout && clearTimeout(this.timeout);
      this.timeout = window.setTimeout(() => (this.isMoving = false), 20);
      this.isMoving = true;
    },
  };

  private constructor() {
    this.position = [0, 0];
    this.velocityVector = new Vector2().set(this.position[0], this.position[1]);
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

  private clearEventListeners() {
    document.removeEventListener('mousemove', this.eventHandlers['mousemove']);
    document.removeEventListener('mousedown', this.eventHandlers['mousedown']);
    document.removeEventListener('mouseup', this.eventHandlers['mouseup']);
    document.removeEventListener('touchstart', this.eventHandlers['touchstart']);
    document.removeEventListener('touchend', this.eventHandlers['touchend']);
    document.removeEventListener('touchmove', this.eventHandlers['touchmove']);
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
    if (!this.instance.isMoving) {
      return new Vector2(0, 0);
    }

    return this.instance.velocityVector.clone().divideScalar(window.innerWidth);
  }

  static SmoothedAngle(): number {
    return this.instance.smoothedAngle.getSmoothed();
  }

  static Reset(): void {
    this.instance.clearEventListeners();
    this.instance = new Mouse();
  }
}
