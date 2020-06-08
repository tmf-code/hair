import { AbstractPlayer } from './abstract-player';
import { cachedMovementCount, sampleInterval } from '../../utilities/constants';
type PlayerLocation = { rotation: number; position: [number, number] };

export class FriendPlayer extends AbstractPlayer {
  private bufferedLocations: PlayerLocation[] = [];

  constructor() {
    super();

    this.startPlayingBackLocations();
  }

  startPlayingBackLocations() {
    setInterval(
      () => requestAnimationFrame(this.playbackBufferedLocations.bind(this)),
      sampleInterval,
    );
  }

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
    this.updateRazorTriangles();
    this.setRazorTransform();
    this.updateScaleDown();
    this.updateRotation();

    return 'CUTTING';
  }

  updateCutting(): 'CUTTING' | 'STOP_CUTTING' {
    this.updateRazorTriangles();
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
    this.updateRazorTriangles();
    this.setRazorTransform();

    return 'NOT_CUTTING';
  }

  private playbackBufferedLocations() {
    const playerLocation = this.bufferedLocations.pop();
    if (playerLocation === undefined) return;

    ({ position: this.position, rotation: this.rotation } = playerLocation);
  }

  private isOffScreen() {
    return this.position[0] < -20 && this.position[1] < -20;
  }

  public serverUpdate(playerLocations: PlayerLocation[]) {
    this.bufferedLocations = playerLocations;
  }
}
