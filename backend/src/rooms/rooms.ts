import { Player } from './player';
import { ServerIoOverload } from '../../../@types/socketio-overloads';
import { Room } from './room';
import { RoomNames } from './room-names';

export interface SocketRoomsOptions {
  playerCapacity: number;
  lowRoomCapacity: number;
  highRoomCapacity: number;
  roomNames: RoomNames;
  verbose?: boolean;
}

export class Rooms {
  protected rooms: readonly Room[] = [];
  private readonly io: ServerIoOverload;
  private readonly playerCapacity: number;
  private readonly roomNames: RoomNames;
  private readonly verbose: boolean;
  private readonly lowRoomCapacity: number;
  private readonly highRoomCapacity: number;

  constructor(
    io: ServerIoOverload,
    {
      playerCapacity,
      lowRoomCapacity,
      highRoomCapacity,
      roomNames,
      verbose = false,
    }: SocketRoomsOptions,
  ) {
    this.playerCapacity = playerCapacity;
    this.lowRoomCapacity = lowRoomCapacity;
    this.highRoomCapacity = highRoomCapacity;
    this.roomNames = roomNames;
    this.io = io;
    this.verbose = verbose;
  }

  private makeRoom(name: string, player: Player): Room {
    const room = Room.withPlayer(
      {
        io: this.io,
        name,
        lowCapacity: this.lowRoomCapacity,
        highCapacity: this.highRoomCapacity,
        verbose: this.verbose,
      },
      player,
    );
    return room;
  }

  addToRandomRoom(player: Player): Room {
    this.throwIfFull(player);
    const [maybeChosenRoom] = this.findLowAvailableRooms();

    const roomCanFitPlayer = maybeChosenRoom !== undefined;
    if (roomCanFitPlayer) {
      this.addToLowRoom(maybeChosenRoom, player);
      return maybeChosenRoom;
    }

    return this.createRandomRoom(player);
  }

  addToNamedRoom(name: string, player: Player): Room {
    this.throwIfFull(player);
    this.throwIfNameInvalid(name);

    const maybeRoom = this.findRoomByName(name);
    const roomDoesNotExist = maybeRoom === undefined;

    if (roomDoesNotExist) {
      const room = this.createNamedRoom(name, player);
      return room;
    }

    if (maybeRoom?.isHighAvailable()) {
      this.addToHighRoom(maybeRoom, player);
      return maybeRoom;
    }

    throw new Error(`Cannot add player ${player.id} to room ${name}. Room is unavailable`);
  }

  private throwIfFull(player: Player) {
    if (this.isFull())
      throw new Error(
        `Cannot add player ${player.id}. PlayerRooms is at capacity ${this.playerCapacity}`,
      );
  }

  private throwIfNameInvalid(name: string) {
    if (!this.isValidRoomName(name))
      throw new Error(`SocketRoom name ${name} is invalid. Cannot add player to room.`);
  }

  getRoomNameOfPlayer(playerId: string): string {
    return this.getRoomOfPlayer(playerId).name;
  }
  tryGetRoomOfPlayer(playerId: string): Room | undefined {
    return this.rooms.find((room) => room.hasPlayer(playerId));
  }

  private getRoomOfPlayer(playerId: string): Room {
    const maybeRoom = this.rooms.find((room) => room.hasPlayer(playerId));
    this.throwIfPlayerNotInRooms(playerId, maybeRoom);

    return maybeRoom!;
  }

  private throwIfPlayerNotInRooms(playerId: string, maybeRoom: Room | undefined) {
    if (maybeRoom === undefined)
      throw new Error(`Cannot get room of player ${playerId}. Player is not in rooms`);
  }

  private findLowAvailableRooms = () => this.rooms.filter((room) => !room.isLowFull());
  findRoomByName = (name: string): Room | undefined =>
    this.rooms.find((room) => room.getName() === name);

  private addToLowRoom(room: Room, player: Player): Room {
    if (room.isLowFull()) {
      return this.createRandomRoom(player);
    }

    room.addHighPlayer(player);

    return room;
  }

  private addToHighRoom(room: Room, player: Player): Room {
    if (room.isHighFull()) {
      return this.createRandomRoom(player);
    }

    room.addHighPlayer(player);
    return room;
  }

  private createRandomRoom(player: Player): Room {
    const name = this.roomNames.getFreeRandomRoomName();
    return this.createNamedRoom(name, player);
  }

  private createNamedRoom(name: string, player: Player): Room {
    const roomExists = this.isExistingRoomName(name);
    if (roomExists)
      throw new Error(
        `Cannot create room ${name} for player ${player.id}. SocketRoom exists already.`,
      );

    this.roomNames.checkOutRoom(name);
    const room = this.makeRoom(name, player);
    this.rooms = [...this.rooms, room];

    return room;
  }

  private isExistingRoomName = (name: string): boolean => {
    const maybeExistingRoom = this.findRoomByName(name);
    return maybeExistingRoom !== undefined;
  };

  removePlayer(playerId: string): Room {
    const room = this.getRoomOfPlayer(playerId);
    room.removePlayer(playerId);

    if (room.isEmpty()) this.removeRoom(room);

    return room;
  }

  private removeRoom(room: Room) {
    const roomExists = this.isExistingRoom(room);
    if (!roomExists)
      throw new Error(`Cannot remove room ${room.getName()}. SocketRoom does not exist.`);
    this.verbose && console.log(`DELETE: room ${room.name}`);
    this.rooms = this.rooms.filter((currentRoom) => currentRoom !== room);
    this.roomNames.checkInRoom(room.getName());
  }

  private isExistingRoom = (room: Room): boolean => {
    const maybeExistingRoom = this.rooms.find((currentRoom) => currentRoom === room);
    return maybeExistingRoom !== undefined;
  };

  private isFull = (): boolean => this.getPlayerCount() >= this.playerCapacity;
  getPlayerCount = (): number =>
    this.rooms.reduce((playerCount, currentRoom) => playerCount + currentRoom.getSize(), 0);
  getRoomCount = (): number => this.rooms.length;
  getPlayerIdPerRoom = (): Record<string, readonly string[]> =>
    this.rooms.reduce((roomsRecord, currentRoom) => {
      return { ...roomsRecord, [currentRoom.getName()]: currentRoom.getPlayers() };
    }, {} as Record<string, readonly string[]>);

  emitPlayerData(): void {
    this.rooms.forEach((room) => room.emitPlayerData());
  }

  isPlayerInRooms = (playerId: string): boolean =>
    this.rooms.some((room) => room.hasPlayer(playerId));

  isRoomAvailable = (name: string): boolean => {
    if (!this.isValidRoomName(name)) return false;

    const maybeRoom = this.findRoomByName(name);
    if (!maybeRoom) return true;

    return maybeRoom.isLowAvailable();
  };

  private isValidRoomName = (name: string) => this.roomNames.isValidRoomName(name);

  logRooms = (): void =>
    console.log(this.rooms.map((room) => `${room.name} - ${room.getPlayers()}`).toString());
}
