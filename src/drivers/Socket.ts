import { HairLengths } from './HairLengths';
import { HairPositions } from './HairPositions';
import { hairRotations } from './HairRotations';
import { HairCuts } from './HairCuts';

export class Socket {
  private static readonly EMIT_INTERVAL = 100;
  private socket: SocketIOClient.Socket;
  private hairCuts: HairCuts;
  private hairLengths: HairLengths;
  hairPositions: HairPositions;

  constructor(
    io: SocketIOClientStatic,
    mode: string,
    hairCuts: HairCuts,
    hairLengths: HairLengths,
    hairPositions: HairPositions,
  ) {
    this.hairCuts = hairCuts;
    this.hairLengths = hairLengths;
    this.hairPositions = hairPositions;
    if (this.validateMode(mode)) {
      this.socket = this.connectSocket(io, mode);
      this.attachSocketHandlers();
      this.createSocketEmitters();
    } else {
      throw new Error(`Mode should be either 'production' or 'development', got ${mode}`);
    }
  }

  private validateMode(mode: string): mode is 'production' | 'development' {
    if (mode !== 'production' && mode !== 'development') return false;
    return true;
  }

  private connectSocket(io: SocketIOClientStatic, mode: 'production' | 'development') {
    return mode === 'production' ? io() : io('http://localhost:3001');
  }

  private attachSocketHandlers() {
    const socketEventHandlers = {
      updateClientGrid: (serverHairPositions: [number, number][]) =>
        this.hairPositions.setPositions(serverHairPositions),

      updateClientGrowth: (growthSpeed: number) => this.hairLengths.grow(growthSpeed),

      updateClientLengths: (serverHairLengths: number[]) =>
        this.hairLengths.updateLengths(serverHairLengths),

      updateClientRotations: (serverHairRotations: number[]) =>
        hairRotations.setRotations(serverHairRotations),

      updateClientCuts: (cuts: boolean[]) => this.hairCuts.addFromServer(cuts),
    };

    Object.entries(socketEventHandlers).forEach(([name, handler]) => {
      this.socket.on(name, handler);
    });
  }

  private createSocketEmitters() {
    setInterval(() => {
      if (this.hairCuts.hasClientCuts()) {
        this.updateServerCuts();
      }
    }, Socket.EMIT_INTERVAL);
  }

  private updateServerCuts() {
    this.socket.emit('updateServerCuts', this.hairCuts.getBufferAndClear());
  }
}
