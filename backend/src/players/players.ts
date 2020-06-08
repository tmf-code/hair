import { PlayerSocket } from './player-socket';
import { IplayerData } from './i-player-data';

export class Players {
  private players: Record<string, PlayerSocket>;
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

  setRecieveCuts(recieveCuts: (cuts: boolean[]) => void) {
    this.recieveCuts = recieveCuts;
  }

  addPlayer(socket: SocketIO.Socket) {
    const { positions, rotations, lengths } = this.getMapState();
    this.players[socket.id] = new PlayerSocket(
      socket,
      this.recieveCuts,
      positions,
      rotations,
      lengths,
    );
  }

  removePlayer(socketId: string) {
    delete this.players[socketId];
  }

  getPlayerLocations() {
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
