import { PlayersDataMessage } from './../../../@types/messages.d';
import { SocketPlayer } from './socket-player';
import { ServerIoOverload } from './../../../@types/socketio-overloads.d';

export class SocketRoom {
  io: ServerIoOverload;
  name: string;
  players: SocketPlayer[];
  capacity: number;

  constructor(io: ServerIoOverload, name: string, firstPlayer: SocketPlayer, capacity: number) {
    this.name = name;
    this.players = [firstPlayer];
    this.capacity = capacity;
    this.io = io;
    firstPlayer.join(this.name);
  }

  addPlayer(player: SocketPlayer): this {
    if (this.isFull())
      throw new Error(`Cannot add player ${player.id} to room ${this.name}. Room is full`);

    this.players.push(player);
    player.join(this.name);

    return this;
  }

  removePlayer(playerId: string): void {
    const maybePlayerIndex = this.players.findIndex(
      (currentPlayer) => currentPlayer.id === playerId,
    );

    const playerNotInRoom = maybePlayerIndex === -1;
    if (playerNotInRoom)
      throw new Error(
        `Cannot remove player ${playerId} from room ${this.name}. Room does not contain player.`,
      );

    const [player] = this.players.splice(maybePlayerIndex, 1);
    player.leave(this.name);
    if (player.destroy) player.destroy();
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

  getPlayers = (): readonly string[] => this.players.map((players) => players.id);
  hasPlayer = (id: string): boolean =>
    this.players.find((currentPlayer) => id === currentPlayer.id) !== undefined;
  isAvailable = (): boolean => !this.isFull() && !this.isEmpty();
  isFull = (): boolean => this.players.length >= this.capacity;
  isEmpty = (): boolean => this.players.length === 0;
  getSize = (): number => this.players.length;
  getName = (): string => this.name;
}
