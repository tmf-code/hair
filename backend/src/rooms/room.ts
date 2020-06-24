import { PlayersDataMessage } from '../../../@types/messages';
import { Player } from './player';
import { ServerIoOverload } from '../../../@types/socketio-overloads';

interface RoomOptions {
  io: ServerIoOverload;
  name: string;
  capacity: number;
}

export class Room {
  io: ServerIoOverload;
  name: string;
  players: Player[] = [];
  capacity: number;

  static withPlayer(options: RoomOptions, firstPlayer: Player): Room {
    const room = new Room(options);
    room.addPlayer(firstPlayer);

    return room;
  }

  constructor({ io, name, capacity }: RoomOptions) {
    this.name = name;
    this.capacity = capacity;
    this.io = io;
  }

  addPlayer(player: Player): this {
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
    player.destroy();
  }

  emitPlayerData(): void {
    const data = this.players.reduce((record, player) => {
      return {
        ...record,
        [player.id]: (player as Player).getPlayerData().bufferedPlayerData,
      };
    }, {} as PlayersDataMessage);
    this.io.to(this.name).emit('updatePlayersData', data);
    this.players.forEach((player) => (player as Player).clearPlayerData());
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
