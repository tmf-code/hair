import { ServerIoOverload } from './../../../@types/socketio-overloads.d';
import { RoomNames } from './../rooms/room-names';
import { GhostPlayerSocket } from './ghost-player-socket';
import { PlayerSocket } from './player-socket';
import { IPlayerSocket } from './i-player-socket';
import { PlayersDataMessage, BufferedPlayerData } from '../../../@types/messages';
import { ServerSocketOverload } from '../../../@types/socketio-overloads';
import { SocketRooms } from './../rooms/socket-rooms';

export class Players {
  private readonly io: ServerIoOverload;
  private players: Record<string, IPlayerSocket>;
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
    this.players = {};
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

    const room = this.placePlayerInRoom(socket);
    this.players[socket.id] = new PlayerSocket(
      socket,
      this.receiveCuts,
      positions,
      rotations,
      lengths,
      room,
    );
  }

  private placePlayerInRoom(socket: ServerSocketOverload) {
    const player = socket;
    this.rooms.addToNextRoom(player);
    const guestsRoom = this.rooms.getRoomNameOfPlayer(player);
    return guestsRoom;
  }

  private addGhostPlayers(count: number) {
    for (let index = 0; index < count; index++) {
      const id = 'IAMTHEGHOSTNAMEDNUM' + index;
      this.players[id] = new GhostPlayerSocket(id, index, count);
    }
  }

  removePlayer(socket: ServerSocketOverload): void {
    const player = socket;
    const guestsRoom = this.rooms.getRoomNameOfPlayer(player);

    this.rooms.removePlayer(player);
    console.log(`Guest disconnected from room ${guestsRoom} with id:${socket.id}`);
    delete this.players[socket.id];
  }

  private getPlayerData(): PlayersDataMessage {
    return Object.values(this.players).reduce((record, player) => {
      const playerData = player.getPlayerData();
      return { ...record, [playerData.id]: playerData.bufferedPlayerData };
    }, {} as PlayersDataMessage);
  }

  private getPlayerIdPerRoom(): Record<string, readonly string[]> {
    return this.rooms.getPlayerIdPerRoom();
  }

  private clearPlayerData(): void {
    Object.values(this.players).forEach((player) => player.clearPlayerData());
  }

  emitPlayerLocations(): void {
    const [playerLocations, rooms] = [this.getPlayerData(), this.getPlayerIdPerRoom()];
    Object.entries(rooms).forEach(([roomName, playersInRoom]) => {
      const data = playersInRoom.reduce((guestLocationsInRoom, player) => {
        return { ...guestLocationsInRoom, [player]: playerLocations[player] };
      }, {} as Record<string, BufferedPlayerData>);

      this.io.to(roomName).emit('updatePlayersData', data);
    });

    this.clearPlayerData();
  }
}
