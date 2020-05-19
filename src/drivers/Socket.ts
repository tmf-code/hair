import io from 'socket.io-client';
import { hairLengths } from './HairLengths';
import { hairPositions } from './HairPositions';
import { hairRotations } from './HairRotations';
import { hairCuts } from './HairCuts';

export class Socket {
  private static readonly EMIT_INTERVAL = 100;
  private socket: SocketIOClient.Socket;

  public constructor() {
    this.socket = this.connectSocket();
    this.attachSocketHandlers();
    this.createSocketEmitters();
  }

  private connectSocket() {
    return process.env.NODE_ENV === 'production' ? io() : io('http://192.168.178.41:3001');
  }

  private attachSocketHandlers() {
    const socketEventHandlers = {
      updateClientGrid: (serverHairPositions: [number, number][]) =>
        hairPositions.setPositions(serverHairPositions),

      updateClientGrowth: (growthSpeed: number) => hairLengths.grow(growthSpeed),

      updateClientLengths: (serverHairLengths: number[]) =>
        hairLengths.updateLengths(serverHairLengths),

      updateClientRotations: (serverHairRotations: number[]) =>
        hairRotations.setRotations(serverHairRotations),

      updateClientCuts: (cuts: boolean[]) => hairCuts.addFromServer(cuts),
    };

    Object.entries(socketEventHandlers).forEach(([name, handler]) => {
      this.socket.on(name, handler);
    });
  }

  private createSocketEmitters() {
    setInterval(() => {
      if (hairCuts.hasClientCuts()) {
        this.updateServerCuts();
      }
    }, Socket.EMIT_INTERVAL);
  }

  private updateServerCuts() {
    this.socket.emit('updateServerCuts', hairCuts.getBufferAndClear());
  }

  public addNewCuts(cuts: boolean[]) {
    hairCuts.addFromClient(cuts);
  }
}
