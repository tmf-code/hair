import { AbstractPlayer } from './abstract-player';

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
    this.setRazorTransform();
    this.updateScaleDown();
    this.updateRotation();

    return 'CUTTING';
  }

  updateCutting(): 'CUTTING' | 'STOP_CUTTING' {
    this.setRazorTransform();
    this.updateScaleDown();
    this.updatePosition();
    this.updateRotation();

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
    return this.position[0] < -20 && this.position[1] < -20;
  }

  public serverUpdate(position: [number, number], rotation: number) {
    this.rotation = rotation;
    this.position = position;
  }
}
