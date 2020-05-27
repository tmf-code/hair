import { Camera, Mesh } from 'three';
import { FriendPlayerRazor } from './friend-player-razor';

export class FriendPlayers {
  players: Record<
    string,
    { rotation: number; position: [number, number]; razor: FriendPlayerRazor }
  > = {};

  updatePlayers(playerData: Record<string, { rotation: number; position: [number, number] }>) {
    Object.entries(playerData).forEach(([id, { rotation, position }]) => {
      if (this.players[id] === undefined) {
        this.players[id] = { rotation, position, razor: new FriendPlayerRazor() };
      }

      const razor: FriendPlayerRazor = this.players[id].razor;
      razor.serverUpdate(position, rotation);
    });
  }

  updateFrame(ref: React.MutableRefObject<Mesh | undefined>, camera: Camera) {
    Object.values(this.players).forEach((player) => {
      player.razor.updateFrame(ref, camera);
    });
  }
}
