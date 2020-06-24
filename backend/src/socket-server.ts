import { EventEmitter } from 'events';
import { SERVER_EMIT_INTERVAL } from './constants';
import SocketIO from 'socket.io';
import { ServerSocketOverload, ServerIoOverload } from '../../@types/socketio-overloads';

type SocketServerMessages = {
  playerDisconnected: ServerSocketOverload;
  receivedCuts: boolean[];
  sendPlayerData: ServerIoOverload;
  requestRoom: [ServerSocketOverload, string];
};

export class SocketServer extends EventEmitter {
  io: ServerIoOverload;

  constructor(server: import('http').Server) {
    super();
    this.io = SocketIO(server);
    this.attachSocketServerHandlers();
    this.startEmitting();
  }

  on<T extends keyof SocketServerMessages>(
    event: T,
    listener: (...args: [SocketServerMessages[T]]) => void,
  ): this {
    return super.on(event, listener);
  }

  emit<T extends keyof SocketServerMessages>(
    event: T,
    ...args: [SocketServerMessages[T]]
  ): boolean {
    return super.emit(event, ...args);
  }

  private attachSocketServerHandlers() {
    this.io.on('connect', (socket) => {
      socket.on('disconnect', () => {
        this.emit('playerDisconnected', socket);
      });

      socket.on('requestRoom', (name) => {
        this.emit('requestRoom', [socket, name]);
      });
    });
  }

  public receiveCuts(incomingCuts: boolean[]): void {
    this.emit('receivedCuts', incomingCuts);
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
    this.emit('sendPlayerData', this.io);
  }
}
