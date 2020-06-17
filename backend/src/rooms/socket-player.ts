import { ServerSocketOverload } from './../../../@types/socketio-overloads.d';
import { IPlayer } from './i-player';
import { BufferedPlayerData } from '../../../@types/messages';
import { IPlayerData } from 'src/players/i-player-data';

export class SocketPlayer implements IPlayer {
  private readonly socket: ServerSocketOverload;
  private readonly receiveCuts: (cuts: boolean[]) => void;
  readonly id: string;

  private bufferedPlayerData: BufferedPlayerData = [];

  constructor(
    socket: ServerSocketOverload,
    receiveCuts: (cuts: boolean[]) => void,
    positions: [number, number][],
    rotations: number[],
    lengths: number[],
  ) {
    this.socket = socket;
    this.id = socket.id;

    this.receiveCuts = receiveCuts;
    this.addHandlers();
    this.emitOnce(positions, rotations, lengths);
  }

  private addHandlers() {
    this.socket.on('updateServerCuts', this.receiveCuts.bind(this));
    this.socket.on('updatePlayerLocation', this.updatePlayerLocation.bind(this));
  }

  private updatePlayerLocation(bufferedPlayerData: BufferedPlayerData) {
    this.bufferedPlayerData = bufferedPlayerData;
  }

  private emitOnce(positions: [number, number][], rotations: number[], lengths: number[]) {
    this.socket.emit('updateClientGrid', positions);
    this.socket.emit('updateClientRotations', rotations);
    this.socket.emit('updateClientLengths', lengths);
  }

  join(room: string): void {
    this.socket.join(room);
    this.socket.emit('updateClientRoom', room);
  }

  leave(room: string): void {
    this.socket.leave(room);
    this.socket.emit('updateClientRoom', '');
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
