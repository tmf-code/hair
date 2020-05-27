import { MapState } from './map-state';
import { IplayerData } from './i-player-data';
import SocketIO from 'socket.io';

export type PlayerSocketCallbacks = {
  receiveCuts: (cuts: boolean[]) => void;
};

export class PlayerSocket {
  private readonly id: string;
  private position: [number, number];
  private rotation: number;
  private readonly socket: SocketIO.Socket;
  private readonly playerSocketCallbacks: PlayerSocketCallbacks;

  constructor(
    socket: SocketIO.Socket,
    callbacks: PlayerSocketCallbacks,
    currentMapState: MapState,
  ) {
    this.id = socket.id;
    this.socket = socket;
    this.playerSocketCallbacks = callbacks;
    this.position = [0, 0];
    this.rotation = 0;

    this.addHandlers();
    this.emitOnce(currentMapState);
  }

  private addHandlers() {
    const socketEventHandlers = {
      updateServerCuts: this.playerSocketCallbacks.receiveCuts.bind(this),

      updatePlayerLocation: ({
        rotation,
        position,
      }: {
        rotation: number;
        position: [number, number];
      }) => {
        this.rotation = rotation;
        this.position = position;
      },
    };

    Object.entries(socketEventHandlers).forEach(([name, handler]) => {
      this.socket.on(name, handler);
    });
  }

  private emitOnce({ positions, rotations, lengths }: MapState) {
    this.socket.emit('updateClientGrid', positions);
    this.socket.emit('updateClientRotations', rotations);
    this.socket.emit('updateClientLengths', lengths);
  }

  getPlayerData(): IplayerData {
    return {
      id: this.id,
      rotation: this.rotation,
      position: this.position,
    };
  }
}
