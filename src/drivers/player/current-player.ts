import { sampleInterval, playerLayer } from './../../utilities/constants';
import { Mouse } from '../mouse/mouse';
import { AbstractPlayer } from './abstract-player';
import { cachedMovementCount } from '../../utilities/constants';
import { BufferedPlayerData, PlayerData } from '../../../@types/messages';

let ids = 0;
export class CurrentPlayer extends AbstractPlayer {
  private bufferedPlayerData: BufferedPlayerData = [];
  id: number;

  constructor() {
    super();
    this.id = ids++;
    this.setLayer(playerLayer);
    this.startBufferingLocations();
  }

  startBufferingLocations(): void {
    setInterval(() => {
      return requestAnimationFrame(() => this.recordBufferedLocations());
    }, sampleInterval);
  }

  private recordBufferedLocations() {
    const newLocation: PlayerData = {
      rotation: this.getRotation(),
      position: this.getPointerPosition(),
      state: this.isCutting() ? 'CUTTING' : 'NOT_CUTTING',
    };

    this.bufferedPlayerData.unshift(newLocation);
    const bufferIsFull = this.bufferedPlayerData.length > cachedMovementCount;
    if (bufferIsFull) {
      this.bufferedPlayerData.pop();
    }
  }

  isCutting(): boolean {
    return Mouse.isClicked() || Mouse.isSingleTouched();
  }

  updateNotCutting(): 'NOT_CUTTING' | 'START_CUTTING' {
    this.setPositionOffscreen();
    this.updateScaleUp();
    this.setRotationToVertical();
    if (this.isCutting()) return 'START_CUTTING';

    return 'NOT_CUTTING';
  }

  updateStartCutting(): 'START_CUTTING' | 'CUTTING' {
    this.setPointerPosition(this.mouse?.toArray() as [number, number]);
    this.snapSmoothedToTargetPosition();
    this.updateRazorTriangles();
    this.setRazorTransform();
    this.updateRotation();

    return 'CUTTING';
  }

  updateCutting(): 'CUTTING' | 'STOP_CUTTING' {
    this.setPointerPosition(this.mouse?.toArray() as [number, number]);
    this.setRotation(Mouse.getDirection());

    this.updateScaleDown();
    this.updateRotation();
    this.updatePosition();
    this.updateRazorTriangles();
    this.setRazorTransform();

    if (!this.isCutting()) {
      return 'STOP_CUTTING';
    }

    return 'CUTTING';
  }

  updateStopCutting(): 'STOP_CUTTING' | 'NOT_CUTTING' {
    this.setRotationToVertical();
    this.setPositionOffscreen();
    this.updateScaleUp();
    this.updatePosition();
    this.updateRotation();
    this.updateRazorTriangles();
    this.setRazorTransform();

    return 'NOT_CUTTING';
  }

  private setRotationToVertical() {
    Mouse.setDirectionToVertical();
    this.setRotation(Mouse.getDirection());
    this.snapSmoothedToTargetRotation();
  }

  getLocation(): BufferedPlayerData {
    return this.bufferedPlayerData;
  }
}
