import { Player } from '../rooms/player';
import { ServerIoOverload } from './../../../@types/socketio-overloads.d';
import { RoomNames } from './../rooms/room-names';
import { ServerSocketOverload } from '../../../@types/socketio-overloads';
import { Rooms } from '../rooms/rooms';
import {
  PLAYER_CAPACITY,
  ROOM_UNDEFINED,
  HIGH_ROOM_CAPACITY,
  LOW_ROOM_CAPACITY,
} from './../constants';
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

export class Players {
  private verbose: boolean;
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
      lowRoomCapacity: LOW_ROOM_CAPACITY,
      highRoomCapacity: HIGH_ROOM_CAPACITY,
      roomNames: roomNames,
      verbose: this.verbose,
    });
  }

  addPlayer(playerId: string, room: typeof ROOM_UNDEFINED | string): Room | undefined {
    try {
      const player = this.getPlayer(playerId);

      if (player.hasRoom()) {
        this.tryRemoveFromRoom(playerId);
        return this.addPlayer(playerId, room);
      }

      if (room === ROOM_UNDEFINED || !this.isValidRoom(room)) {
        return this.addToRandomRoom(player);
      }

      return this.addToChosenRoom(player, room);
    } catch (error) {
      console.error(error);
      console.log('Did not add player to rooms');
    }

    return undefined;
  }

  private getPlayer(playerId: string): Player {
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

  private addToRandomRoom(player: Player): Room | undefined {
    this.throwIfPlayerHasRoom(player);
    const room = this.rooms.addToRandomRoom(player);
    this.verbose && console.log(`ADD RANDOM: Player ${player.id} to room ${room.getName()}`);
    return room;
  }

  private throwIfPlayerHasRoom(player: Player) {
    if (player.hasRoom()) {
      throw new Error(`Player ${player.id} already in room ${player.tryGetRoom()}`);
    }
  }

  private addToChosenRoom(player: Player, roomName: string): Room {
    this.throwIfPlayerHasRoom(player);
    this.throwIfRoomNameIsInvalid(roomName);

    const room = this.rooms.addToNamedRoom(roomName, player);
    if (room.name !== roomName) {
      this.verbose && console.log(`ADD CHOSEN: Player ${player.id} to room ${roomName}`);
    } else {
      this.verbose && console.log(`ADD CHOSEN: Player ${player.id} to room ${roomName}`);
    }

    return room;
  }

  private throwIfRoomNameIsInvalid(room: string) {
    if (!this.isValidRoom(room)) {
      throw new Error(`Room name ${room} is invalid. Could not add player to chosen room.`);
    }
  }

  setReceiveCuts(receiveCuts: (cuts: boolean[]) => void): void {
    this.receiveCuts = receiveCuts;
  }

  connectSocket(socket: ServerSocketOverload): Player {
    try {
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
      this.verbose && console.log(`CONNECTED: socket ${socket.id}`);
      return player;
    } catch (error) {
      this.verbose && console.error(error);
      return this.getPlayer(socket.id);
    }
  }

  private throwIfSocketExists(socket: ServerSocketOverload) {
    if (this.doesPlayerExist(socket.id)) {
      throw new Error(`Cannot connect socket ${socket.id}. Player already exists`);
    }
  }

  disconnectSocket(socket: ServerSocketOverload): void {
    try {
      this.throwIfPlayerMissing(socket.id);
      this.players = this.players.filter((currentPlayer) => currentPlayer.id !== socket.id);
      this.tryRemoveFromRoom(socket.id);
    } catch (error) {
      this.verbose && console.error(error);
    }
  }

  private tryRemoveFromRoom(playerId: string) {
    try {
      const room = this.rooms.removePlayer(playerId);
      this.verbose && console.log(`REMOVE: Player ${playerId} disconnected from room ${room.name}`);
    } catch (error) {
      this.verbose && console.error(error);
      this.verbose &&
        console.error(`Player ${playerId} connection was not in room. Could not delete.`);
    }
  }

  emitPlayerLocations = (): void => this.rooms.emitPlayerData();
  doesPlayerExist = (playerId: string): boolean => this.players.some(({ id }) => id === playerId);
  connectionCount = (): number => this.players.length;
  private isValidRoom = (room: string) => this.roomNames.isValidRoomName(room);
}
