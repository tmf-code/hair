import { GhostPlayerSocket } from './ghost-player-socket';
import { PlayerSocket } from './player-socket';
import { IPlayerSocket } from './i-player-socket';
import { PlayersDataMessage } from '../../../@types/messages';

export class Players {
  private players: Record<string, IPlayerSocket>;
  private getMapState: () => {
    positions: [number, number][];
    rotations: number[];
    lengths: number[];
  };
  private receiveCuts: (cuts: boolean[]) => void = (cuts) => null;

  constructor(
    getMapState: () => { positions: [number, number][]; rotations: number[]; lengths: number[] },
  ) {
    this.players = {};
    this.getMapState = getMapState;
  }

  setReceiveCuts(receiveCuts: (cuts: boolean[]) => void): void {
    this.receiveCuts = receiveCuts;
  }

  addPlayer(socket: SocketIO.Socket): void {
    const { positions, rotations, lengths } = this.getMapState();
    this.players[socket.id] = new PlayerSocket(
      socket,
      this.receiveCuts,
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

  getPlayerLocations(): PlayersDataMessage {
    return Object.values(this.players).reduce((record, player) => {
      const playerData = player.getPlayerData();
      return { ...record, [playerData.id]: playerData.playerLocations };
    }, {} as PlayersDataMessage);
  }
}
