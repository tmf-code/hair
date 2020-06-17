import { RoomNames } from './../rooms/room-names';
import { Rooms } from '../rooms/rooms';
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

  private rooms = new Rooms({
    playerCapacity: 100,
    roomCapacity: 4,
    roomNames: RoomNames.createFromStandardNames(),
  });

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
      room,
    );
  }

  private placePlayerInRoom(socket: ServerSocketOverload) {
    const player = socket;
    this.rooms.addToNextRoom(player);
    const guestsRoom = this.rooms.getRoomNameOfPlayer(player);
    socket.join(guestsRoom);
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

  getPlayerData(): PlayersDataMessage {
    return Object.values(this.players).reduce((record, player) => {
      const playerData = player.getPlayerData();
      return { ...record, [playerData.id]: playerData.bufferedPlayerData };
    }, {} as PlayersDataMessage);
  }

  getPlayerIdPerRoom(): Record<string, readonly string[]> {
    return this.rooms.getPlayerIdPerRoom();
  }

  clearPlayerData(): void {
    Object.values(this.players).forEach((player) => player.clearPlayerData());
  }
}
