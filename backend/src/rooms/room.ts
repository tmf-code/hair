import { PlayersDataMessage } from '../../../@types/messages';
import { Player } from './player';
import { ServerIoOverload } from '../../../@types/socketio-overloads';

interface RoomOptions {
  io: ServerIoOverload;
  name: string;
  capacity: number;
  upgradedCapacity: number;
  verbose?: boolean;
}

export class Room {
  io: ServerIoOverload;
  name: string;
  players: Player[] = [];
  capacity: number;
  normalCapacity: number;
  upgradedCapacity: number;
  verbose: boolean;

  static withPlayer(options: RoomOptions, firstPlayer: Player): Room {
    const room = new Room(options);
    room.addPlayer(firstPlayer);

    return room;
  }

  constructor({ io, name, capacity, upgradedCapacity, verbose = false }: RoomOptions) {
    this.name = name;
    this.capacity = capacity;
    this.normalCapacity = this.capacity;
    this.upgradedCapacity = upgradedCapacity;
    this.io = io;
    this.verbose = verbose;

    this.verbose && console.log(`CREATED: ${this.name}`);
  }

  upgrade(): void {
    this.capacity = this.upgradedCapacity;
    this.verbose && console.log(`UPGRADED: ${this.name}`);
  }

  private downgrade(): void {
    if (this.getSize() > this.normalCapacity) {
      throw new Error(
        `Could not downgrade room ${
          this.name
        }. Room had too player players. Got ${this.getSize()}, expected ${this.normalCapacity}`,
      );
    }
    this.capacity = this.normalCapacity;
    this.verbose && console.log(`DOWNGRADED: ${this.name}`);
  }

  addPlayer(player: Player): this {
    this.throwIfFull(player);
    this.throwIfDuplicate(player);
    this.players.push(player);
    player.join(this.name);

    return this;
  }

  private throwIfFull(player: Player) {
    if (this.isFull())
      throw new Error(`Cannot add player ${player.id} to room ${this.name}. Room is full`);
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

    const shouldDowngrade = this.getSize() <= this.normalCapacity && this.isUpgraded();
    if (shouldDowngrade) {
      this.downgrade();
    }
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
  isUpgraded = (): boolean => this.capacity === this.upgradedCapacity;
  isEmpty = (): boolean => this.players.length === 0;
  getSize = (): number => this.players.length;
  getName = (): string => this.name;
}
