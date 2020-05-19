import io from 'socket.io-client';
import type { Grid, HairLengths } from '../types/types';

type Vector2 = [number, number];

export class Socket {
  static readonly EMIT_INTERVAL = 100;
  public listeners: Map<string, Function[]> = new Map();
  public socket: SocketIOClient.Socket;

  public lengths: number[] = [];
  public grid: Vector2[] = [];
  public rotations: number[] = [];
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
      if (this.clienthasCut()) {
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

  private clienthasCut() {
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

  updateCuts(cuts: boolean[]) {
    this.lengths = this.lengths.map((length, lengthIndex) => (cuts[lengthIndex] ? 0 : length));
    this.myCuts = cuts.map((currentCut, cutIndex) => currentCut || this.myCuts[cutIndex]);
  }
}

export const socket = new Socket();
