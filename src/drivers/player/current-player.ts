import { sampleInterval, playerLayer } from './../../utilities/constants';
import { Mouse } from '../mouse/mouse';
import { Player } from './player';
import { PlayerData } from '../../../@types/messages';

export class CurrentPlayer extends Player {
  constructor() {
    super();
    this.setLayer(playerLayer);
    this.startRecordingPlayerData();
  }

  private startRecordingPlayerData(): void {
    setInterval(() => {
      return requestAnimationFrame(() => this.recordPlayerData());
    }, sampleInterval);
  }

  private recordPlayerData() {
    if (document.hidden) return;

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

  updateNotCutting(): void {
    this.setRotationToVertical();
  }

  updateStopCutting(): void {
    this.setRotationToVertical();
  }

  private setRotationToVertical() {
    Mouse.setDirectionToVertical();
    this.setRotation(Mouse.getDirection());
    this.snapSmoothedToTargetRotation();
  }
}
