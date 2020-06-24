import { ServerSocketOverload } from '../../../@types/socketio-overloads';
import { BufferedPlayerData } from '../../../@types/messages';
import { IPlayerData } from '../players/i-player-data';

interface PlayerOptions {
  socket: ServerSocketOverload;
  receiveCuts: (cuts: boolean[]) => void;
  positions: [number, number][];
  rotations: number[];
  lengths: number[];
}

export class Player {
  private readonly socket: ServerSocketOverload;
  private readonly receiveCuts: (cuts: boolean[]) => void;
  readonly id: string;
  private room: string | undefined;

  private bufferedPlayerData: BufferedPlayerData = [];

  constructor({ socket, receiveCuts, positions, rotations, lengths }: PlayerOptions) {
    this.socket = socket;
    this.id = socket.id;

    this.receiveCuts = receiveCuts;
    this.receiveCuts = this.receiveCuts.bind(this);
    this.updatePlayerLocation = this.updatePlayerLocation.bind(this);
    this.emitOnce(positions, rotations, lengths);

    this.addHandlers();
  }

  destroy(): void {
    this.socket.removeListener('updateServerCuts', this.receiveCuts);
    this.socket.removeListener('updatePlayerLocation', this.updatePlayerLocation);
  }

  private addHandlers() {
    this.socket.on('updateServerCuts', this.receiveCuts);
    this.socket.on('updatePlayerLocation', this.updatePlayerLocation);
  }

  private updatePlayerLocation(bufferedPlayerData: BufferedPlayerData) {
    this.bufferedPlayerData = [...bufferedPlayerData];
  }

  private emitOnce(positions: [number, number][], rotations: number[], lengths: number[]) {
    this.socket.emit('updateClientGrid', positions);
    this.socket.emit('updateClientRotations', rotations);
    this.socket.emit('updateClientLengths', lengths);
  }

  join(room: string): void {
    this.room = room;
    this.socket.join(room);
    this.socket.emit('updateClientRoom', room);
  }

  leave(room: string): void {
    this.room = undefined;
    this.socket.leave(room);
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

  hasRoom = (): boolean => this.room !== undefined;
  tryGetRoom = (): string | undefined => this.room;
}
