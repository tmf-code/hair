import io from 'socket.io-client';
import type { Grid, HairLengths } from '../types/types';

type Vector2 = [number, number];

export class Socket {
  private static readonly EMIT_INTERVAL = 100;
  private socket: SocketIOClient.Socket;
  private _lengths: number[] = [];
  private _grid: Vector2[] = [];
  private _rotations: number[] = [];

  public get lengths(): number[] {
    return this._lengths;
  }
  public set lengths(value: number[]) {
    this._lengths = value;
  }

  public get grid(): Vector2[] {
    return this._grid;
  }
  public set grid(value: Vector2[]) {
    this._grid = value;
  }

  public get rotations(): number[] {
    return this._rotations;
  }
  public set rotations(value: number[]) {
    this._rotations = value;
  }
  private myCuts: boolean[] = [];

  private socketEventHandlers = {
    updateClientGrid: (grid: Grid) => {
      this.grid = grid;
    },
    updateClientGrowth: (growthSpeed: number) => {
      this.lengths = this.lengths.map((length) => Math.min(length + growthSpeed, 1));
    },
    updateClientLengths: (lengths: HairLengths) => {
      this.lengths = lengths;
    },
    updateClientRotations: (rotations: number[]) => {
      this.rotations = rotations;
    },
    updateClientCuts: (cuts: boolean[]) => {
      this.lengths = this.lengths.map((length, lengthIndex) => (cuts[lengthIndex] ? 0 : length));
    },
  };

  private attachSocketHandlers(socket: SocketIOClient.Socket) {
    Object.entries(this.socketEventHandlers).forEach(([name, handler]) => {
      socket.on(name, handler);
    });
  }

  private createSocketEmitters(socket: SocketIOClient.Socket) {
    setInterval(() => {
      if (this.clientHasCut()) {
        this.updateServerCuts(socket);
        this.resetClientCuts();
      }
    }, Socket.EMIT_INTERVAL);
  }

  private updateServerCuts(socket: SocketIOClient.Socket) {
    socket.emit('updateServerCuts', this.myCuts);
  }

  private resetClientCuts() {
    this.myCuts = this.myCuts.map(() => false);
  }

  private clientHasCut() {
    return this.myCuts.some(Boolean);
  }

  private createSocket() {
    return process.env.NODE_ENV === 'production' ? io() : io('http://192.168.178.41:3001');
  }

  public constructor() {
    const socket = this.createSocket();
    this.attachSocketHandlers(socket);
    this.createSocketEmitters(socket);

    this.socket = socket;
  }

  private cutLengths(cuts: boolean[]) {
    this.lengths = this.lengths.map((length, lengthIndex) => (cuts[lengthIndex] ? 0 : length));
  }

  private addNewCuts(cuts: boolean[]) {
    this.myCuts = cuts.map((currentCut, cutIndex) => currentCut || this.myCuts[cutIndex]);
  }

  updateCuts(cuts: boolean[]) {
    this.cutLengths(cuts);
    this.addNewCuts(cuts);
  }
}

export const socket = new Socket();
