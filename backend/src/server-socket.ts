import { SERVER_EMIT_INTERVAL } from './constants';
import SocketIO from 'socket.io';

export type ServerSocketCallbacks = {
  onPlayerConnected: (socket: SocketIO.Socket) => void;
  onPlayerDisconnected: (playerId: string) => void;
  onEmitPlayerLocations: () => Record<
    string,
    {
      rotation: number;
      position: [number, number];
    }[]
  >;
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

  public recieveCuts(incomingCuts: boolean[]): void {
    this.serverSocketCallbacks.onReceiveCuts(incomingCuts);
  }
  private startEmitting() {
    const emit = () => {
      this.emitPlayerLocations();

      const thisWasDestroyed = this === undefined;
      if (!thisWasDestroyed) {
        setTimeout(emit, SERVER_EMIT_INTERVAL);
      }
    };
    emit();
  }

  private emitPlayerLocations() {
    const playerLocations = this.serverSocketCallbacks.onEmitPlayerLocations();
    this.io.emit('updateClientPlayerLocations', playerLocations);
  }
}
