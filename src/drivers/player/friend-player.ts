import { AbstractPlayer } from './abstract-player';
import { offscreen } from '../../utilities/constants';

export class FriendPlayer extends AbstractPlayer {
  updateNotCutting(): 'NOT_CUTTING' | 'START_CUTTING' {
    this.updateScaleUp();
    this.updatePosition();
    this.updateRotation();

    if (!this.isOffScreen()) {
      return 'START_CUTTING';
    }

    return 'NOT_CUTTING';
  }

  updateStartCutting(): 'START_CUTTING' | 'CUTTING' {
    this.smoothedPosition = this.position;
    this.updateScaleDown();
    this.updatePosition();
    this.updateRotation();
    this.setRazorTransform();

    return 'CUTTING';
  }

  updateCutting(): 'CUTTING' | 'STOP_CUTTING' {
    this.updateScaleDown();
    this.updatePosition();
    this.updateRotation();
    this.setRazorTransform();

    if (this.isOffScreen()) {
      return 'STOP_CUTTING';
    }

    return 'CUTTING';
  }

  updateStopCutting(): 'NOT_CUTTING' | 'STOP_CUTTING' {
    this.setPositionOffscreen();
    this.updateScaleUp();
    this.updatePosition();
    this.updateRotation();
    this.setRazorTransform();

    return 'NOT_CUTTING';
  }

  private isOffScreen() {
    return this.position[0] === offscreen[0] && this.position[0] === offscreen[1];
  }

  public serverUpdate(position: [number, number], rotation: number) {
    this.rotation = rotation;
    this.position = position;
  }
}
