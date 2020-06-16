import { NotEmptyRooms } from './../rooms/room';
import {
  findRoomOfGuest,
  addGuestToRooms,
  startRooms,
  removeGuest,
} from './../rooms/room-operations';
import { GhostPlayerSocket } from './ghost-player-socket';
import { PlayerSocket } from './player-socket';
import { IPlayerSocket } from './i-player-socket';
import { PlayersDataMessage } from '../../../@types/messages';
import { ServerSocketOverload } from '../../../@types/socketio-overloads';

export class Players {
  private players: Record<string, IPlayerSocket>;
  private getMapState: () => {
    positions: [number, number][];
    rotations: number[];
    lengths: number[];
  };
  private receiveCuts: (cuts: boolean[]) => void = (cuts) => null;

  private rooms = startRooms();

  constructor(
    getMapState: () => { positions: [number, number][]; rotations: number[]; lengths: number[] },
  ) {
    this.players = {};
    this.getMapState = getMapState;
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
      room.name,
    );
  }

  private placePlayerInRoom(socket: ServerSocketOverload) {
    const guest = socket;
    this.rooms = addGuestToRooms(guest, this.rooms);
    const guestsRoom = findRoomOfGuest(guest, this.rooms);
    socket.join(guestsRoom.name);
    return guestsRoom;
  }

  private addGhostPlayers(count: number) {
    for (let index = 0; index < count; index++) {
      const id = 'IAMTHEGHOSTNAMEDNUM' + index;
      this.players[id] = new GhostPlayerSocket(id, index, count);
    }
  }

  removePlayer(socket: ServerSocketOverload): void {
    const guest = socket;
    const guestsRoom = findRoomOfGuest(guest, this.rooms);

    this.rooms = removeGuest(guest, this.rooms);
    console.log(`Guest disconnected from room ${guestsRoom.name} with id:${socket.id}`);
    delete this.players[socket.id];
  }

  getPlayerData(): PlayersDataMessage {
    return Object.values(this.players).reduce((record, player) => {
      const playerData = player.getPlayerData();
      return { ...record, [playerData.id]: playerData.bufferedPlayerData };
    }, {} as PlayersDataMessage);
  }

  getRooms(): readonly NotEmptyRooms[] {
    return this.rooms;
  }
}
