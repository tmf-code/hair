import { IplayerData } from './i-player-data';
import SocketIO from 'socket.io';

export type PlayerSocketCallbacks = {
  receiveCuts: (cuts: boolean[]) => void;
};

type PlayerLocations = { position: [number, number]; rotation: number }[];

export class PlayerSocket {
  private readonly id: string;
  private playerLocations: PlayerLocations = [];
  private readonly socket: SocketIO.Socket;
  private readonly receiveCuts: (cuts: boolean[]) => void;

  constructor(
    socket: SocketIO.Socket,
    receiveCuts: (cuts: boolean[]) => void,
    positions: [number, number][],
    rotations: number[],
    lengths: number[],
  ) {
    this.id = socket.id;
    this.socket = socket;
    this.receiveCuts = receiveCuts;

    this.addHandlers();
    this.emitOnce(positions, rotations, lengths);
  }

  private addHandlers() {
    const socketEventHandlers = {
      updateServerCuts: this.receiveCuts.bind(this),
      updatePlayerLocation: this.updatePlayerLocation.bind(this),
    };

    Object.entries(socketEventHandlers).forEach(([name, handler]) => {
      this.socket.on(name, handler);
    });
  }

  private updatePlayerLocation(playerLocations: PlayerLocations) {
    this.playerLocations = playerLocations;
  }

  private emitOnce(positions: [number, number][], rotations: number[], lengths: number[]) {
    this.socket.emit('updateClientGrid', positions);
    this.socket.emit('updateClientRotations', rotations);
    this.socket.emit('updateClientLengths', lengths);
  }

  getPlayerData(): IplayerData {
    return {
      id: this.id,
      playerLocations: this.playerLocations,
    };
  }
}
