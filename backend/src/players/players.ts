import { GhostPlayerSocket } from './ghost-player-socket';
import { PlayerSocket } from './player-socket';
import { IPlayerSocket } from './i-player-socket';

export class Players {
  private players: Record<string, IPlayerSocket>;
  private getMapState: () => {
    positions: [number, number][];
    rotations: number[];
    lengths: number[];
  };
  private recieveCuts: (cuts: boolean[]) => void = (cuts) => null;

  constructor(
    getMapState: () => { positions: [number, number][]; rotations: number[]; lengths: number[] },
  ) {
    this.players = {};
    this.getMapState = getMapState;
  }

  setRecieveCuts(recieveCuts: (cuts: boolean[]) => void): void {
    this.recieveCuts = recieveCuts;
  }

  addPlayer(socket: SocketIO.Socket): void {
    const { positions, rotations, lengths } = this.getMapState();
    this.players[socket.id] = new PlayerSocket(
      socket,
      this.recieveCuts,
      positions,
      rotations,
      lengths,
    );
  }

  private addGhostPlayers(count: number) {
    for (let index = 0; index < count; index++) {
      const id = 'IAMTHEGHOSTNAMEDNUM' + index;
      this.players[id] = new GhostPlayerSocket(id, index, count);
    }
  }

  removePlayer(socketId: string): void {
    delete this.players[socketId];
  }

  getPlayerLocations(): Record<
    string,
    {
      rotation: number;
      position: [number, number];
    }[]
  > {
    return Object.values(this.players).reduce(
      (record, player) => {
        const playerData = player.getPlayerData();
        return { ...record, [playerData.id]: playerData.playerLocations };
      },
      {} as Record<
        string,
        {
          rotation: number;
          position: [number, number];
        }[]
      >,
    );
  }
}
