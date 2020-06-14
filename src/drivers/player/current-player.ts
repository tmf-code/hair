import { sampleInterval, playerLayer } from './../../utilities/constants';
import { Mouse } from '../mouse/mouse';
import { AbstractPlayer } from './abstract-player';
import { PlayerData } from '../../../@types/messages';

export class CurrentPlayer extends AbstractPlayer {
  constructor() {
    super();
    this.setLayer(playerLayer);
    this.startRecordingPlayerData();
  }

  startRecordingPlayerData(): void {
    setInterval(() => {
      return requestAnimationFrame(() => this.recordPlayerData());
    }, sampleInterval);
  }

  private recordPlayerData() {
    const data: PlayerData = {
      rotation: this.getRotation(),
      position: this.getPointerPosition(),
      state: this.isCutting() ? 'CUTTING' : 'NOT_CUTTING',
    };

    this.addPlayerData(data);
  }

  beforeEachState(): void {
    this.setPointerPosition(this.mouse?.toArray() as [number, number]);
    this.setRotation(Mouse.getDirection());
    this.setState(Mouse.isClicked() || Mouse.isSingleTouched() ? 'CUTTING' : 'NOT_CUTTING');
  }

  updateNotCutting(): 'NOT_CUTTING' | 'START_CUTTING' {
    this.setRotationToVertical();
    if (this.isCutting()) return 'START_CUTTING';

    return 'NOT_CUTTING';
  }

  updateStartCutting(): 'START_CUTTING' | 'CUTTING' {
    return 'CUTTING';
  }

  updateCutting(): 'CUTTING' | 'STOP_CUTTING' {
    if (!this.isCutting()) return 'STOP_CUTTING';

    return 'CUTTING';
  }

  updateStopCutting(): 'STOP_CUTTING' | 'NOT_CUTTING' {
    this.setRotationToVertical();
    return 'NOT_CUTTING';
  }

  private setRotationToVertical() {
    Mouse.setDirectionToVertical();
    this.setRotation(Mouse.getDirection());
    this.snapSmoothedToTargetRotation();
  }
}
