import io from 'socket.io-client';
import type { Grid } from '../types/types';
import { HairLengths } from './HairLengths';
import { HairPositions } from './HairPositions';

export class Socket {
  private static readonly EMIT_INTERVAL = 100;
  private lengths = new HairLengths();
  private hairPositions = new HairPositions();
  private rotations: number[] = [];

  public getLengths(): number[] {
    return this.lengths.getLengths();
  }

  public getHairPositions(): [number, number][] {
    return this.hairPositions.getPositions();
  }

  public getRotations(): number[] {
    return this.rotations;
  }

  private myCuts: boolean[] = [];

  public constructor() {
    const socket = this.createSocket();
    this.attachSocketHandlers(socket);
    this.createSocketEmitters(socket);
  }

  private createSocket() {
    return process.env.NODE_ENV === 'production' ? io() : io('http://192.168.178.41:3001');
  }

  private attachSocketHandlers(socket: SocketIOClient.Socket) {
    const socketEventHandlers = {
      updateClientGrid: (grid: Grid) => {
        this.hairPositions.setPositions(grid);
      },
      updateClientGrowth: (growthSpeed: number) => {
        this.lengths.grow(growthSpeed);
      },
      updateClientLengths: (lengths: number[]) => {
        this.lengths.updateLengths(lengths);
      },
      updateClientRotations: (rotations: number[]) => {
        this.rotations = rotations;
      },
      updateClientCuts: (cuts: boolean[]) => {
        this.lengths.cutHairs(cuts);
      },
    };
    Object.entries(socketEventHandlers).forEach(([name, handler]) => {
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

  private clientHasCut() {
    return this.myCuts.some(Boolean);
  }

  private updateServerCuts(socket: SocketIOClient.Socket) {
    socket.emit('updateServerCuts', this.myCuts);
  }

  private resetClientCuts() {
    this.myCuts = this.myCuts.map(() => false);
  }

  updateCuts(cuts: boolean[]) {
    this.cutLengths(cuts);
    this.addNewCuts(cuts);
  }

  private cutLengths(cuts: boolean[]) {
    this.lengths.cutHairs(cuts);
  }

  private addNewCuts(cuts: boolean[]) {
    this.myCuts = cuts.map((currentCut, cutIndex) => currentCut || this.myCuts[cutIndex]);
  }
}

export const socket = new Socket();
