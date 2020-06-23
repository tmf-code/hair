import { SocketPlayer } from './../rooms/socket-player';
import { ServerIoOverload } from './../../../@types/socketio-overloads.d';
import { RoomNames } from './../rooms/room-names';
import { ServerSocketOverload } from '../../../@types/socketio-overloads';
import { SocketRooms } from './../rooms/socket-rooms';
import { PLAYER_CAPACITY, ROOM_CAPACITY } from './../constants';

export class Players {
  private readonly io: ServerIoOverload;
  private getMapState: () => {
    positions: [number, number][];
    rotations: number[];
    lengths: number[];
  };
  private receiveCuts: (cuts: boolean[]) => void = (cuts) => null;

  private rooms: SocketRooms;

  constructor(
    io: ServerIoOverload,
    getMapState: () => { positions: [number, number][]; rotations: number[]; lengths: number[] },
  ) {
    this.io = io;
    this.getMapState = getMapState;

    this.rooms = new SocketRooms(this.io, {
      playerCapacity: PLAYER_CAPACITY,
      roomCapacity: ROOM_CAPACITY,
      roomNames: RoomNames.createFromStandardNames(),
    });
  }

  setReceiveCuts(receiveCuts: (cuts: boolean[]) => void): void {
    this.receiveCuts = receiveCuts;
  }

  addPlayer(socket: ServerSocketOverload): void {
    const { positions, rotations, lengths } = this.getMapState();
    this.placePlayerInNextRoom(socket, positions, rotations, lengths);
  }

  private placePlayerInNextRoom(
    socket: ServerSocketOverload,
    positions: [number, number][],
    rotations: number[],
    lengths: number[],
  ) {
    const player = new SocketPlayer({
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
      console.log(`Guest disconnected from room ${guestsRoom} with id:${socket.id}`);
    } catch (error) {
      console.log(error);
      console.error(`Player ${playerId} connection was not in room. Could not delete.`);
    }
  }

  changeRoom(socket: ServerSocketOverload, name: string): void {
    const { id: playerId } = socket;

    try {
      const guestsRoom = this.rooms.getRoomNameOfPlayer(playerId);
      const needsToChangeRoom = guestsRoom !== name;
      if (!needsToChangeRoom) return;

      this.removePlayer(socket);
      const { positions, rotations, lengths } = this.getMapState();
      const player = new SocketPlayer({
        socket,
        receiveCuts: this.receiveCuts,
        positions,
        rotations,
        lengths,
      });
      const room = this.rooms.addToNamedRoom(name, player);
      console.log(`ADD CHOSEN: ${socket.id} to room ${room.getName()}`);
    } catch (error) {
      console.log(error);
      console.error(`Unable to add Player ${socket.id} to custom room ${name}.`);
      console.log(` Adding player ${socket.id} to random room`);
      this.addPlayer(socket);
    }
  }

  emitPlayerLocations(): void {
    this.rooms.emitPlayerData();
  }
}
