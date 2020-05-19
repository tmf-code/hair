import io from 'socket.io-client';
import { hairLengths } from './HairLengths';
import { hairPositions } from './HairPositions';
import { hairRotations } from './HairRotations';

export class Socket {
  private static readonly EMIT_INTERVAL = 100;
  private clientCutsToSend: boolean[] = [];

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
      updateClientGrid: (serverHairPositions: [number, number][]) => {
        hairPositions.setPositions(serverHairPositions);
      },
      updateClientGrowth: (growthSpeed: number) => {
        hairLengths.grow(growthSpeed);
      },
      updateClientLengths: (serverHairLengths: number[]) => {
        hairLengths.updateLengths(serverHairLengths);
      },
      updateClientRotations: (serverHairRotations: number[]) => {
        hairRotations.setRotations(serverHairRotations);
      },
      updateClientCuts: (cuts: boolean[]) => {
        hairLengths.cutHairs(cuts);
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
    return this.clientCutsToSend.some(Boolean);
  }

  private updateServerCuts(socket: SocketIOClient.Socket) {
    socket.emit('updateServerCuts', this.clientCutsToSend);
  }

  private resetClientCuts() {
    this.clientCutsToSend = this.clientCutsToSend.map(() => false);
  }

  public addNewCuts(cuts: boolean[]) {
    this.clientCutsToSend = cuts.map(
      (currentCut, cutIndex) => currentCut || this.clientCutsToSend[cutIndex],
    );
  }
}

export const socket = new Socket();
