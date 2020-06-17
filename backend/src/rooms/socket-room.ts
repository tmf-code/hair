import { ServerSocketOverload, ServerIoOverload } from './../../../@types/socketio-overloads.d';
import { Room } from './room';

export class SocketRoom extends Room {
  io: ServerIoOverload;

  constructor(
    io: ServerIoOverload,
    name: string,
    firstPlayer: ServerSocketOverload,
    capacity: number,
  ) {
    super(name, firstPlayer, capacity);
    this.io = io;
  }

  addPlayer(player: ServerSocketOverload): void {
    super.addPlayer(player);
    player.join(this.name);
  }

  removePlayer(player: ServerSocketOverload): void {
    super.removePlayer(player);
    player.leave(this.name);
  }
}
