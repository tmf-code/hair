import { BufferedPlayerData } from './../../../@types/messages.d';
import { IPlayerData } from './i-player-data';
import { IPlayerSocket } from './i-player-socket';
import { ServerSocketOverload } from '../../../@types/socketio-overloads';

export type PlayerSocketCallbacks = {
  receiveCuts: (cuts: boolean[]) => void;
};

export class PlayerSocket implements IPlayerSocket {
  private readonly id: string;
  private bufferedPlayerData: BufferedPlayerData = [];
  private readonly socket: ServerSocketOverload;
  private readonly receiveCuts: (cuts: boolean[]) => void;
  private readonly room: string;

  constructor(
    socket: ServerSocketOverload,
    receiveCuts: (cuts: boolean[]) => void,
    positions: [number, number][],
    rotations: number[],
    lengths: number[],
    room: string,
  ) {
    this.id = socket.id;
    this.socket = socket;
    this.receiveCuts = receiveCuts;
    this.room = room;

    this.addHandlers();
    this.emitOnce(positions, rotations, lengths, room);

    console.log(`Guest connected to room ${this.room} with id:${this.id}`);
  }

  private addHandlers() {
    this.socket.on('updateServerCuts', this.receiveCuts.bind(this));
    this.socket.on('updatePlayerLocation', this.updatePlayerLocation.bind(this));
  }

  private updatePlayerLocation(bufferedPlayerData: BufferedPlayerData) {
    this.bufferedPlayerData = bufferedPlayerData;
  }

  private emitOnce(
    positions: [number, number][],
    rotations: number[],
    lengths: number[],
    room: string,
  ) {
    this.socket.emit('updateClientGrid', positions);
    this.socket.emit('updateClientRotations', rotations);
    this.socket.emit('updateClientLengths', lengths);
    this.socket.emit('updateClientRoom', room);
  }

  clearPlayerData(): void {
    this.bufferedPlayerData = [];
  }

  getPlayerData(): IPlayerData {
    return {
      id: this.id,
      bufferedPlayerData: this.bufferedPlayerData,
    };
  }
}
