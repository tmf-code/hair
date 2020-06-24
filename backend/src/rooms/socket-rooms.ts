import { SocketPlayer } from './socket-player';
import { ServerIoOverload } from './../../../@types/socketio-overloads.d';
import { Room } from './room';
import { RoomNames } from './room-names';

export interface SocketRoomsOptions {
  playerCapacity: number;
  roomCapacity: number;
  roomNames: RoomNames;
}

export class SocketRooms {
  protected rooms: readonly Room[] = [];
  private readonly io: ServerIoOverload;
  private readonly playerCapacity: number;
  private readonly roomCapacity: number;
  private readonly roomNames: RoomNames;

  constructor(
    io: ServerIoOverload,
    { playerCapacity, roomCapacity, roomNames }: SocketRoomsOptions,
  ) {
    this.playerCapacity = playerCapacity;
    this.roomCapacity = roomCapacity;
    this.roomNames = roomNames;
    this.io = io;
  }

  private makeRoom(name: string, player: SocketPlayer, roomCapacity: number): Room {
    const room = new Room(this.io, name, player, roomCapacity);
    return room;
  }

  addToNextRoom(player: SocketPlayer): Room {
    this.throwIfFull(player);
    const [maybeChosenRoom] = this.findAvailableRooms();

    const roomCanFitPlayer = maybeChosenRoom !== undefined;
    if (roomCanFitPlayer) {
      this.addToRoom(maybeChosenRoom, player);
      return maybeChosenRoom;
    }

    return this.createRandomRoom(player);
  }

  addToNamedRoom(name: string, player: SocketPlayer): Room {
    this.throwIfFull(player);
    this.throwIfNameInvalid(name);

    const maybeRoom = this.findRoomByName(name);
    const roomDoesNotExist = maybeRoom === undefined;

    if (roomDoesNotExist) {
      return this.createNamedRoom(name, player);
    }

    if (maybeRoom?.isAvailable()) {
      this.addToRoom(maybeRoom, player);
      return maybeRoom;
    }

    return this.addToNextRoom(player);
  }

  private throwIfFull(player: SocketPlayer) {
    if (this.isFull())
      throw new Error(
        `Cannot add player ${player.id}. PlayerRooms is at capacity ${this.playerCapacity}`,
      );
  }

  private throwIfNameInvalid(name: string) {
    if (!this.roomNames.isValidRoomName(name))
      throw new Error(`SocketRoom name ${name} is invalid. Cannot add player to room.`);
  }

  getRoomNameOfPlayer(playerId: string): string {
    return this.getRoomOfPlayer(playerId).name;
  }
  tryGetRoomNameOfPlayer(player: SocketPlayer): string | undefined {
    return this.rooms.find((room) => room.hasPlayer(player.id))?.name;
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

  private findAvailableRooms = () => this.rooms.filter((room) => room.isAvailable());
  private findRoomByName = (name: string) => this.rooms.find((room) => room.getName() === name);

  private addToRoom(room: Room, player: SocketPlayer): Room {
    try {
      room.addPlayer(player);
    } catch (error) {
      console.error(error);
      this.createRandomRoom(player);
    }

    return room;
  }

  private createRandomRoom(player: SocketPlayer): Room {
    const name = this.roomNames.getFreeRandomRoomName();
    return this.createNamedRoom(name, player);
  }

  private createNamedRoom(name: string, player: SocketPlayer): Room {
    const roomExists = this.isExistingRoomName(name);
    if (roomExists)
      throw new Error(
        `Cannot create room ${name} for player ${player.id}. SocketRoom exists already.`,
      );

    this.roomNames.checkOutRoom(name);
    const room = this.makeRoom(name, player, this.roomCapacity);
    this.rooms = [...this.rooms, room];

    return room;
  }

  private isExistingRoomName = (name: string) => {
    const maybeExistingRoom = this.findRoomByName(name);
    return maybeExistingRoom !== undefined;
  };

  removePlayer(playerId: string): void {
    const room = this.getRoomOfPlayer(playerId);
    room.removePlayer(playerId);

    if (room.isEmpty()) this.removeRoom(room);
  }

  private removeRoom(room: Room) {
    const roomExists = this.isExistingRoom(room);
    if (!roomExists)
      throw new Error(`Cannot remove room ${room.getName()}. SocketRoom does not exist.`);

    this.rooms = this.rooms.filter((currentRoom) => currentRoom !== room);
    this.roomNames.checkInRoom(room.getName());
  }

  private isExistingRoom = (room: Room) => {
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

  logRooms = (): void =>
    console.log(this.rooms.map((room) => `${room.name} - ${room.getPlayers()}`).toString());
}
