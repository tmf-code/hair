import { Player } from '../rooms/player';
import { ServerIoOverload } from './../../../@types/socketio-overloads.d';
import { RoomNames } from './../rooms/room-names';
import { ServerSocketOverload } from '../../../@types/socketio-overloads';
import { Rooms } from '../rooms/rooms';
import { PLAYER_CAPACITY, ROOM_CAPACITY } from './../constants';
import { Room } from '../rooms/room';

interface PlayersOptions {
  io: ServerIoOverload;
  getMapState: () => {
    positions: [number, number][];
    rotations: number[];
    lengths: number[];
  };
  roomNames: RoomNames;
  verbose?: boolean;
}

const ROOM_UNDEFINED = 'UNDEFINED' as const;
export class Players {
  private addToChosenRoom(player: Player, room: string): Room {
    this.throwIfPlayerHasRoom(player);
    this.throwIfRoomNameIsInvalid(room);

    this.verbose && console.log(`ADD CHOSEN: Player ${player.id} to room ${room}`);
    return this.rooms.addToNamedRoom(room, player);
  }

  private throwIfRoomNameIsInvalid(room: string) {
    if (!this.isValidRoom(room)) {
      throw new Error(`Room name ${room} is invalid. Could not add player to chosen room.`);
    }
  }

  private isValidRoom(room: string) {
    return this.roomNames.isValidRoomName(room);
  }

  private throwIfPlayerHasRoom(player: Player) {
    if (player.hasRoom()) {
      throw new Error(`Player ${player.id} already in room ${player.tryGetRoom()}`);
    }
  }

  private verbose: boolean;
  private addToRandomRoom(player: Player): Room | undefined {
    this.throwIfPlayerHasRoom(player);
    const room = this.rooms.addToNextRoom(player);
    this.verbose && console.log(`ADD RANDOM: Player ${player.id} to room ${room.getName()}`);
    return room;
  }

  addPlayer(playerId: string, room: typeof ROOM_UNDEFINED | string): Room | undefined {
    try {
      const player = this.getPlayer(playerId);

      if (player.hasRoom()) {
        return this.rooms.tryGetRoomOfPlayer(player.id)!;
      }

      if (room === ROOM_UNDEFINED || !this.isValidRoom(room)) {
        return this.addToRandomRoom(player);
      }

      if (this.rooms.isRoomAvailable(room)) {
        return this.addToChosenRoom(player, room);
      }

      return this.addToRandomRoom(player);
    } catch (error) {
      console.error(error);
      console.log('Did not add player to rooms');
    }

    return undefined;
  }

  getPlayer(playerId: string): Player {
    this.throwIfPlayerMissing(playerId);
    return this.tryGetPlayer(playerId)!;
  }

  private tryGetPlayer = (playerId: string): Player | undefined =>
    this.players.find(({ id }) => id === playerId);

  private throwIfPlayerMissing(playerId: string) {
    if (!this.doesPlayerExist(playerId)) {
      throw new Error(`Cannot get player ${playerId}. Player does not exist`);
    }
  }

  private readonly io: ServerIoOverload;
  private getMapState: () => {
    positions: [number, number][];
    rotations: number[];
    lengths: number[];
  };
  private receiveCuts: (cuts: boolean[]) => void = (cuts) => null;

  private roomNames: RoomNames;
  private rooms: Rooms;
  private players: Player[] = [];

  constructor({ io, getMapState, verbose = false, roomNames }: PlayersOptions) {
    this.io = io;
    this.getMapState = getMapState;
    this.roomNames = roomNames;
    this.verbose = verbose;
    this.rooms = new Rooms(this.io, {
      playerCapacity: PLAYER_CAPACITY,
      roomCapacity: ROOM_CAPACITY,
      roomNames: roomNames,
      verbose: this.verbose,
    });
  }

  setReceiveCuts(receiveCuts: (cuts: boolean[]) => void): void {
    this.receiveCuts = receiveCuts;
  }

  connectSocket(socket: ServerSocketOverload): void {
    this.throwIfSocketExists(socket);

    const { positions, rotations, lengths } = this.getMapState();
    const player = new Player({
      socket,
      receiveCuts: this.receiveCuts,
      positions,
      rotations,
      lengths,
    });

    this.players.push(player);
  }

  private throwIfSocketExists(socket: ServerSocketOverload) {
    if (this.doesPlayerExist(socket.id)) {
      throw new Error(`Cannot connect socket ${socket.id}. Player already exists`);
    }
  }

  disconnectSocket(socket: ServerSocketOverload): void {
    this.throwIfPlayerMissing(socket.id);

    this.players = this.players.filter((currentPlayer) => currentPlayer.id !== socket.id);
    this.tryRemoveFromRoom(socket.id);
  }

  private tryRemoveFromRoom(playerId: string) {
    try {
      this.rooms.removePlayer(playerId);
    } catch {}
  }

  private placePlayerInNextRoom(
    socket: ServerSocketOverload,
    positions: [number, number][],
    rotations: number[],
    lengths: number[],
  ) {
    const player = new Player({
      socket,
      receiveCuts: this.receiveCuts,
      positions,
      rotations,
      lengths,
    });
    try {
      const room = this.rooms.addToNextRoom(player);
      console.log(`ADD RANDOM: Player ${socket.id} to room ${room.getName()}`);
    } catch (error) {
      console.log(error);
      console.log('Something went wrong, muting player');
      player.destroy();
    }
  }

  removePlayer(socket: ServerSocketOverload): void {
    const { id: playerId } = socket;

    try {
      const guestsRoom = this.rooms.getRoomNameOfPlayer(playerId);
      this.rooms.removePlayer(playerId);
      console.log(`REMOVE: Player ${socket.id} disconnected from room ${guestsRoom}`);
    } catch (error) {
      console.log(error);
      console.error(`Player ${playerId} connection was not in room. Could not delete.`);
    }
  }

  private changeRoom(socket: ServerSocketOverload, name: string): void {
    const { id: playerId } = socket;

    try {
      const guestsRoom = this.rooms.getRoomNameOfPlayer(playerId);
      const needsToChangeRoom = guestsRoom !== name;
      if (!needsToChangeRoom) return;

      this.removePlayer(socket);
      const { positions, rotations, lengths } = this.getMapState();
      const player = new Player({
        socket,
        receiveCuts: this.receiveCuts,
        positions,
        rotations,
        lengths,
      });
      const room = this.rooms.addToNamedRoom(name, player);
      console.log(`ADD CHOSEN: ${socket.id} to room ${room.getName()}`);
    } catch (error) {
      console.error(`Unable to add Player ${socket.id} to custom room ${name}.`);
      console.log(`Adding player ${socket.id} to random room`);
      this.connectSocket(socket);
    }
  }

  emitPlayerLocations = (): void => this.rooms.emitPlayerData();
  doesPlayerExist = (playerId: string): boolean => this.players.some(({ id }) => id === playerId);
  connectionCount = (): number => this.players.length;
}
