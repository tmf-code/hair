import { Camera, Mesh, Vector2 } from 'three';
import { FriendPlayer } from './friend-player';

export class FriendPlayers {
  players: Record<
    string,
    { rotation: number; position: [number, number]; razor: FriendPlayer }
  > = {};

  updatePlayers(playerData: Record<string, { rotation: number; position: [number, number] }>) {
    Object.entries(playerData).forEach(([id, { rotation, position }]) => {
      if (this.players[id] === undefined) {
        this.players[id] = { rotation, position, razor: new FriendPlayer() };
      }

      const razor: FriendPlayer = this.players[id].razor;
      razor.serverUpdate(position, rotation);
    });
  }

  updateFrame(
    ref: React.MutableRefObject<Mesh | undefined>,
    mouse: Vector2,
    aspect: number,
    camera: Camera,
  ) {
    Object.values(this.players).forEach((player) => {
      player.razor.updateFrame(ref, mouse, aspect, camera);
    });
  }

  containsPoint([xPos, yPos]: [number, number]) {
    return Object.values(this.players).some((player) => player.razor.containsPoint([xPos, yPos]));
  }
}
