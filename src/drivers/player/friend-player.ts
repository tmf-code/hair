import { BufferedPlayerData } from './../../../@types/messages.d';
import { friendLayer } from './../../utilities/constants';
import { AbstractPlayer } from './abstract-player';
import { sampleInterval } from '../../utilities/constants';
import { PlayerData } from '../../../@types/messages';

export class FriendPlayer extends AbstractPlayer {
  private bufferedPlayerData: BufferedPlayerData = [];
  private state: PlayerData['state'] = 'NOT_CUTTING';

  constructor() {
    super();
    this.setLayer(friendLayer);
    this.startPlayingBackLocations();
  }

  startPlayingBackLocations(): void {
    setInterval(
      () => requestAnimationFrame(this.playbackBufferedLocations.bind(this)),
      sampleInterval,
    );
  }

  updateNotCutting(): 'NOT_CUTTING' | 'START_CUTTING' {
    this.updateScaleUp();
    this.updatePosition();
    this.updateRotation();

    if (this.isCutting()) {
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

    if (!this.isCutting()) {
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
    const playerLocation = this.bufferedPlayerData.pop();
    if (playerLocation === undefined) return;

    ({ position: this.position, rotation: this.rotation, state: this.state } = playerLocation);
  }

  isCutting(): boolean {
    return this.state === 'CUTTING';
  }

  public serverUpdate(BufferedPlayerData: BufferedPlayerData): void {
    this.bufferedPlayerData = BufferedPlayerData;
  }
}
