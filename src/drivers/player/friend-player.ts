import { friendLayer } from './../../utilities/constants';
import { Player } from './player';
import { sampleInterval } from '../../utilities/constants';
import { PlayerData } from '../../../@types/messages';

export class FriendPlayer extends Player {
  private playbackPointerPosition: [number, number] = [0, 0];
  private playbackRotation = 0;
  private playbackActionState: PlayerData['state'] = 'NOT_CUTTING';
  constructor() {
    super();
    this.setLayer(friendLayer);
    this.startPlayingBackPlayerData();
  }

  private startPlayingBackPlayerData(): void {
    setInterval(() => requestAnimationFrame(this.playbackPlayerData.bind(this)), sampleInterval);
  }

  private playbackPlayerData() {
    const data = this.getPlayerData();
    if (data === undefined) return;
    const { position, rotation, state } = data;

    this.playbackPointerPosition = position;
    this.playbackRotation = rotation;
    this.setState(state);
    this.playbackActionState = state;
  }

  beforeEachState(): void {
    this.setPointerPosition(this.playbackPointerPosition);
    this.setRotation(this.playbackRotation);
    this.setState(this.playbackActionState);
  }
}
