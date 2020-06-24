import { PlayersDataMessage } from '../../../@types/messages';
import { Player } from './player';
import { ServerIoOverload } from '../../../@types/socketio-overloads';

interface RoomOptions {
  io: ServerIoOverload;
  name: string;
  lowCapacity: number;
  highCapacity: number;
  verbose?: boolean;
}

export class Room {
  io: ServerIoOverload;
  name: string;
  players: Player[] = [];
  lowCapacity: number;
  highCapacity: number;
  verbose: boolean;

  static withPlayer(options: RoomOptions, firstPlayer: Player): Room {
    const room = new Room(options);
    room.addLowPlayer(firstPlayer);

    return room;
  }

  constructor({ io, name, lowCapacity, highCapacity, verbose = false }: RoomOptions) {
    this.name = name;
    this.lowCapacity = lowCapacity;
    this.highCapacity = highCapacity;
    this.io = io;
    this.verbose = verbose;

    this.verbose && console.log(`CREATED: ${this.name}`);
  }

  addHighPlayer(player: Player): this {
    this.throwIfHighFull(player);
    this.throwIfDuplicate(player);
    this.players.push(player);
    player.join(this.name);

    return this;
  }

  addLowPlayer(player: Player): this {
    this.throwIfLowFull(player);
    this.throwIfDuplicate(player);
    this.players.push(player);
    player.join(this.name);

    return this;
  }

  private throwIfHighFull(player: Player) {
    if (this.isHighFull())
      throw new Error(`Cannot add player ${player.id} to room ${this.name}. Room is high full`);
  }
  private throwIfLowFull(player: Player) {
    if (this.isLowFull())
      throw new Error(`Cannot add player ${player.id} to room ${this.name}. Room is low full`);
  }

  private throwIfDuplicate(player: Player) {
    if (this.hasPlayer(player.id)) {
      throw new Error(
        `Cannot add player ${player.id} to room ${this.name}. Player already in room`,
      );
    }
  }

  removePlayer(playerId: string): void {
    this.throwIfUnknown(playerId);

    const player = this.getPlayer(playerId);
    this.players = this.players.filter(({ id }) => id !== player?.id);
    player?.leave(this.name);
    player?.destroy();
  }

  private throwIfUnknown(playerId: string) {
    if (!this.hasPlayer(playerId)) {
      throw new Error(
        `Cannot remove player ${playerId} from room ${this.name}. Room does not contain player.`,
      );
    }
  }

  private getPlayer(playerId: string) {
    return this.players.find(({ id }) => id === playerId);
  }

  emitPlayerData(): void {
    const data = this.players.reduce((record, player) => {
      return {
        ...record,
        [player.id]: player.getPlayerData().bufferedPlayerData,
      };
    }, {} as PlayersDataMessage);
    this.io.to(this.name).emit('updatePlayersData', data);
    this.players.forEach((player) => player.clearPlayerData());
  }

  getPlayers = (): readonly string[] => this.players.map((players) => players.id);
  hasPlayer = (id: string): boolean =>
    this.players.find((currentPlayer) => id === currentPlayer.id) !== undefined;
  isLowAvailable = (): boolean => !this.isLowFull() && !this.isEmpty();
  isHighAvailable = (): boolean => !this.isHighFull() && !this.isEmpty();
  isLowFull = (): boolean => this.players.length >= this.lowCapacity;
  isHighFull = (): boolean => this.players.length >= this.highCapacity;
  isEmpty = (): boolean => this.players.length === 0;
  getSize = (): number => this.players.length;
  getName = (): string => this.name;
}
