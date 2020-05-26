import { Camera, Mesh } from 'three';
import { RazorOther } from './razor-other';

export class Players {
  players: Record<string, { rotation: number; position: [number, number]; razor: RazorOther }> = {};

  updatePlayers(playerData: Record<string, { rotation: number; position: [number, number] }>) {
    Object.entries(playerData).forEach(([id, { rotation, position }]) => {
      if (this.players[id] === undefined) {
        this.players[id] = { rotation, position, razor: new RazorOther() };
      }

      const razor: RazorOther = this.players[id].razor;
      razor.serverUpdate(position, rotation);
    });
  }

  updateFrame(ref: React.MutableRefObject<Mesh | undefined>, camera: Camera) {
    Object.values(this.players).forEach((player) => {
      player.razor.updateFrame(ref, camera);
    });
  }
}
