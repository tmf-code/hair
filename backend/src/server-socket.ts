import { IplayerData } from './players/i-player-data';
import { SERVER_EMIT_INTERVAL, SERVER_LENGTH_SYNC_INTERVAL } from './constants';
import SocketIO from 'socket.io';

export type ServerSocketCallbacks = {
  onPlayerConnected: (socket: SocketIO.Socket) => void;
  onPlayerDisconnected: (playerId: string) => void;
  onEmitPlayerLocations: () => Record<string, IplayerData>;
  onEmitHairLengths: () => number[];
  onReceiveCuts: (cuts: boolean[]) => void;
};

export class ServerSocket {
  private io: SocketIO.Server;
  private serverSocketCallbacks: ServerSocketCallbacks;

  constructor(server: import('http').Server, serverSocketCallbacks: ServerSocketCallbacks) {
    this.io = SocketIO(server);
    this.serverSocketCallbacks = serverSocketCallbacks;
    this.attachSocketServerHandlers();
    this.startEmitting();
  }

  private attachSocketServerHandlers() {
    this.io.on('connect', (socket) => {
      this.serverSocketCallbacks.onPlayerConnected(socket);

      socket.on('disconnect', () => {
        this.serverSocketCallbacks.onPlayerDisconnected(socket.id);
      });
    });
  }

  public recieveCuts(incomingCuts: boolean[]) {
    this.serverSocketCallbacks.onReceiveCuts(incomingCuts);
  }

  private startEmitting() {
    this.startInterval(this.emitPlayerLocations.bind(this), SERVER_EMIT_INTERVAL);
    this.startInterval(this.emitHairLengths.bind(this), SERVER_LENGTH_SYNC_INTERVAL);
  }

  private startInterval(callback: Function, millis: number) {
    const emit = () => {
      callback();

      const thisWasDestroyed = this === undefined;
      if (!thisWasDestroyed) {
        setTimeout(emit, millis);
      }
    };
    emit();
  }

  private emitHairLengths() {
    const lengths = this.serverSocketCallbacks.onEmitHairLengths();
    this.io.emit('updateClientLengths', lengths);
  }

  private emitPlayerLocations() {
    const playerLocations = this.serverSocketCallbacks.onEmitPlayerLocations();
    this.io.emit('updateClientPlayerLocations', playerLocations);
  }
}
