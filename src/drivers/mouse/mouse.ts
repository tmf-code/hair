import {
  mouseVelocitySampleInterval,
  mouseDirectionSampleInterval,
  mouseDirectionSmoothing,
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

  private direction: MouseDirection = new MouseDirection(
    mouseDirectionSampleInterval,
    this.velocity.getVelocity.bind(this.velocity),
    mouseDirectionSmoothing,
  );

  static getPosition() {
    return this.instance.position.getPosition();
  }

  static isClicked() {
    return this.instance.clickState.getIsClicked();
  }

  static isSingleTouched() {
    return this.instance.touchState.getIsSingleTouched();
  }

  static isDoubleTouched() {
    return this.instance.touchState.getIsDoubleTouched();
  }

  static getVelocity() {
    return this.instance.velocity.getVelocity();
  }

  static getSmoothedDirection() {
    return this.instance.direction.getSmoothedDirection();
  }

  static getDirection() {
    return this.instance.direction.getDirection();
  }

  static reset() {
    this.instance = new Mouse();
  }
}
