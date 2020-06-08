import { Camera, Mesh, Vector2 } from 'three';
import { FriendPlayer } from './friend-player';

type PlayerLocation = { rotation: number; position: [number, number] };
export class FriendPlayers {
  players: Record<string, { razor: FriendPlayer }> = {};

  updatePlayers(playerData: Record<string, PlayerLocation[]>) {
    this.removeDisconnectedPlayers(playerData);

    const playerDataList = Object.entries(playerData);
    this.addNewPlayers(playerDataList);
    this.updatePlayerLocations(playerDataList);
  }

  private addNewPlayers(playerData: [string, PlayerLocation[]][]) {
    playerData.forEach(([id]) => {
      const playerHasConnected = this.players[id] === undefined;
      if (playerHasConnected) {
        this.players[id] = { razor: new FriendPlayer() };
      }
    });
  }

  private removeDisconnectedPlayers(playerData: Record<string, PlayerLocation[]>) {
    Object.entries(this.players).forEach(([id]) => {
      const playerHasDisconnected = !playerData.hasOwnProperty(id);
      if (playerHasDisconnected) {
        delete this.players[id];
      }
    });
  }

  private updatePlayerLocations(playerData: [string, PlayerLocation[]][]) {
    playerData.forEach(([id, playerLocations]) => {
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
