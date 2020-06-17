import { SocketPlayer } from './socket-player';
import { ServerIoOverload } from './../../../@types/socketio-overloads.d';
import { SocketRoom } from './socket-room';
import { Rooms } from './rooms';
import { RoomNames } from './room-names';

export interface SocketRoomsOptions {
  playerCapacity: number;
  roomCapacity: number;
  roomNames: RoomNames;
}

export class SocketRooms extends Rooms {
  protected rooms: readonly SocketRoom[] = [];
  private readonly io: ServerIoOverload;

  constructor(
    io: ServerIoOverload,
    { playerCapacity, roomCapacity, roomNames }: SocketRoomsOptions,
  ) {
    super({ playerCapacity, roomCapacity, roomNames });
    this.io = io;
  }

  protected makeRoom(name: string, player: SocketPlayer, roomCapacity: number): SocketRoom {
    const room = new SocketRoom(this.io, name, player, roomCapacity);
    return room;
  }

  addToNextRoom(player: SocketPlayer): SocketRoom {
    const room = super.addToNextRoom(player) as SocketRoom;
    return room;
  }

  getRoomToPlayerMap(): string[] {
    return this.rooms.map((room) => `${room.getName()} - ${room.getPlayers()}`);
  }

  emitPlayerData(): void {
    this.rooms.forEach((room) => room.emitPlayerData());
  }
}
