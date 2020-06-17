import { ServerIoOverload } from './../../../@types/socketio-overloads.d';
import { SocketRoom } from './socket-room';
import { Rooms } from './rooms';
import { RoomNames } from './room-names';
import { Room } from './room';
import { ServerSocketOverload } from '../../../@types/socketio-overloads';

export interface SocketRoomsOptions {
  playerCapacity: number;
  roomCapacity: number;
  roomNames: RoomNames;
}

export class SocketRooms extends Rooms {
  protected rooms: readonly Room[] = [];
  private readonly io: ServerIoOverload;

  constructor(
    io: ServerIoOverload,
    { playerCapacity, roomCapacity, roomNames }: SocketRoomsOptions,
  ) {
    super({ playerCapacity, roomCapacity, roomNames });
    this.io = io;
  }

  protected makeRoom(name: string, player: ServerSocketOverload, roomCapacity: number): SocketRoom {
    return new SocketRoom(this.io, name, player, roomCapacity);
  }
}
