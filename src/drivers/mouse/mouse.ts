import { MouseTarget } from './mouse-target';
import {
  mouseVelocitySampleInterval,
  mouseDirectionSampleInterval,
} from './../../utilities/constants';

import { MouseVelocity } from './mouse-velocity';
import { MouseClickState } from './mouse-click-state';
import { MouseTouchState } from './mouse-touch-state';
import { MousePosition } from './mouse-position';
import { MouseDirection } from './mouse-direction';

export class Mouse {
  static instance = new Mouse();

  private position: MousePosition = new MousePosition();
  private clickState: MouseClickState = new MouseClickState();
  private touchState: MouseTouchState = new MouseTouchState();
  private velocity: MouseVelocity = new MouseVelocity(
    mouseVelocitySampleInterval,
    this.position.getPosition.bind(this.position),
  );
  private target: MouseTarget = new MouseTarget();

  private direction: MouseDirection = new MouseDirection(
    mouseDirectionSampleInterval,
    this.velocity.getVelocity.bind(this.velocity),
  );

  static getPosition(): [number, number] {
    return this.instance.position.getPosition();
  }

  static isClicked(): boolean {
    return this.instance.clickState.getIsClicked();
  }

  static isSingleTouched(): boolean {
    return this.instance.touchState.getIsSingleTouched();
  }

  static isDoubleTouched(): boolean {
    return this.instance.touchState.getIsDoubleTouched();
  }

  static getVelocity(): [number, number] {
    return this.instance.velocity.getVelocity();
  }

  static getDirection(): number {
    return this.instance.direction.getDirection();
  }

  static setDirectionToVertical(): void {
    this.instance.direction.setToVertical();
  }

  static reset(): void {
    this.instance = new Mouse();
  }

  static getTarget(): string {
    return this.instance.target.getTarget();
  }
}
