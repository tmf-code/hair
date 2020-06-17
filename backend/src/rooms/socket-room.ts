import { PlayersDataMessage } from './../../../@types/messages.d';
import { SocketPlayer } from './socket-player';
import { ServerIoOverload } from './../../../@types/socketio-overloads.d';
import { Room } from './room';

export class SocketRoom extends Room {
  io: ServerIoOverload;

  constructor(io: ServerIoOverload, name: string, firstPlayer: SocketPlayer, capacity: number) {
    super(name, firstPlayer, capacity);
    this.io = io;
  }

  addPlayer(player: SocketPlayer): this {
    super.addPlayer(player);
    player.join(this.name);

    return this;
  }

  removePlayer(player: SocketPlayer): void {
    super.removePlayer(player);
    player.leave(this.name);
  }

  emitPlayerData(): void {
    const data = this.players.reduce((record, player) => {
      return {
        ...record,
        [player.id]: (player as SocketPlayer).getPlayerData().bufferedPlayerData,
      };
    }, {} as PlayersDataMessage);
    this.io.to(this.name).emit('updatePlayersData', data);
    this.players.forEach((player) => (player as SocketPlayer).clearPlayerData());
  }
}
