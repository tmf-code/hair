import { NotEmptyRooms } from './rooms/room';
import { PlayersDataMessage, BufferedPlayerData } from './../../@types/messages.d';
import { SERVER_EMIT_INTERVAL } from './constants';
import SocketIO from 'socket.io';
import { ServerSocketOverload, ServerIoOverload } from '../../@types/socketio-overloads';

export type ServerSocketCallbacks = {
  onPlayerConnected: (socket: ServerSocketOverload) => void;
  onPlayerDisconnected: (socket: ServerSocketOverload) => void;
  onEmitPlayerData: () => [PlayersDataMessage, readonly NotEmptyRooms[]];
  onSentPlayerData: () => void;
  onReceiveCuts: (cuts: boolean[]) => void;
};

export class SocketServer {
  private io: ServerIoOverload;
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
        this.serverSocketCallbacks.onPlayerDisconnected(socket);
      });
    });
  }

  public receiveCuts(incomingCuts: boolean[]): void {
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
    const [playerLocations, rooms] = this.serverSocketCallbacks.onEmitPlayerData();
    rooms.forEach((room) => {
      const data = room.guests.reduce((guestLocationsInRoom, guest) => {
        return { ...guestLocationsInRoom, [guest.id]: playerLocations[guest.id] };
      }, {} as Record<string, BufferedPlayerData>);
      this.io.to(room.name).emit('updatePlayersData', data);
    });
    this.serverSocketCallbacks.onSentPlayerData();
  }
}
