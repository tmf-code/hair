import io from 'socket.io-client';
import type { Grid } from '../types/types';
import { HairLengths } from './HairLengths';
import { HairPositions } from './HairPositions';
import { HairRotations } from './HairRotations';

export class Socket {
  private static readonly EMIT_INTERVAL = 100;
  private hairLengths = new HairLengths();
  private hairPositions = new HairPositions();
  private hairRotations = new HairRotations();

  public getHairLengths(): number[] {
    return this.hairLengths.getLengths();
  }

  public getHairPositions(): [number, number][] {
    return this.hairPositions.getPositions();
  }

  public getRotations(): number[] {
    return this.hairRotations.getRotations();
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
        this.hairLengths.grow(growthSpeed);
      },
      updateClientLengths: (hairLengths: number[]) => {
        this.hairLengths.updateLengths(hairLengths);
      },
      updateClientRotations: (hairRotations: number[]) => {
        this.hairRotations.setRotations(hairRotations);
      },
      updateClientCuts: (cuts: boolean[]) => {
        this.hairLengths.cutHairs(cuts);
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
    this.hairLengths.cutHairs(cuts);
  }

  private addNewCuts(cuts: boolean[]) {
    this.myCuts = cuts.map((currentCut, cutIndex) => currentCut || this.myCuts[cutIndex]);
  }
}

export const socket = new Socket();
