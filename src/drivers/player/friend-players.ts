import { Camera, Mesh, Vector2 } from 'three';
import { FriendPlayer } from './friend-player';

type PlayerLocation = { rotation: number; position: [number, number] };
export class FriendPlayers {
  players: Record<string, { razor: FriendPlayer }> = {};

  updatePlayers(playerData: Record<string, PlayerLocation[]>) {
    Object.entries(playerData).forEach(([id, playerLocations]) => {
      if (this.players[id] === undefined) {
        this.players[id] = { razor: new FriendPlayer() };
      }

      const razor: FriendPlayer = this.players[id].razor;
      razor.serverUpdate(playerLocations);
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
