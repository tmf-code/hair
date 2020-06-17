import { SocketPlayer } from './../rooms/socket-player';
import { ServerIoOverload } from './../../../@types/socketio-overloads.d';
import { RoomNames } from './../rooms/room-names';
import { ServerSocketOverload } from '../../../@types/socketio-overloads';
import { SocketRooms } from './../rooms/socket-rooms';

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
      playerCapacity: 100,
      roomCapacity: 4,
      roomNames: RoomNames.createFromStandardNames(),
    });
  }

  setReceiveCuts(receiveCuts: (cuts: boolean[]) => void): void {
    this.receiveCuts = receiveCuts;
  }

  addPlayer(socket: ServerSocketOverload): void {
    const { positions, rotations, lengths } = this.getMapState();
    const room = this.placePlayerInNextRoom(socket, positions, rotations, lengths);

    console.log(`ADD RANDOM: Player ${socket.id} to room ${room.getName()}`);
  }

  private placePlayerInNextRoom(
    socket: ServerSocketOverload,
    positions: [number, number][],
    rotations: number[],
    lengths: number[],
  ) {
    const player = new SocketPlayer(socket, this.receiveCuts, positions, rotations, lengths);
    return this.rooms.addToNextRoom(player);
  }

  removePlayer(socket: ServerSocketOverload): void {
    const player = socket;

    try {
      const guestsRoom = this.rooms.getRoomNameOfPlayer(player);
      this.rooms.removePlayer(player);
      console.log(`Guest disconnected from room ${guestsRoom} with id:${socket.id}`);
    } catch (error) {
      console.log(error);
      console.error(`Player ${player.id} connection was not in room. Could not delete.`);
    }
  }

  changeRoom(socket: ServerSocketOverload, name: string): void {
    this.removePlayer(socket);

    const { positions, rotations, lengths } = this.getMapState();
    try {
      const player = new SocketPlayer(socket, this.receiveCuts, positions, rotations, lengths);
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
