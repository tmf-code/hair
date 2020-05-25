export type SocketCallbacks = {
  setPositions: (positions: [number, number][]) => void;
  setRotations: (rotations: number[]) => void;
  setLengths: (lengths: number[]) => void;
  tickGrowth: (growthSpeed: number) => void;
  setRemoteCuts: (cuts: boolean[]) => void;
  sendLocalCuts: () => boolean[];
  sentLocalCuts: () => void;
};

export class Socket {
  private static readonly EMIT_INTERVAL = 100;
  private socket: SocketIOClient.Socket;
  private socketCallbacks: SocketCallbacks;

  constructor(io: SocketIOClientStatic, mode: string, socketCallbacks: SocketCallbacks) {
    if (this.validateMode(mode)) {
      this.socket = this.connectSocket(io, mode);
      this.attachSocketHandlers();
      this.createSocketEmitters();
    } else {
      throw new Error(`Mode should be either 'production' or 'development', got ${mode}`);
    }

    this.socketCallbacks = socketCallbacks;
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
        this.socketCallbacks.setPositions(serverHairPositions),

      updateClientGrowth: (growthSpeed: number) => this.socketCallbacks.tickGrowth(growthSpeed),

      updateClientLengths: (serverHairLengths: number[]) =>
        this.socketCallbacks.setLengths(serverHairLengths),

      updateClientRotations: (serverHairRotations: number[]) =>
        this.socketCallbacks.setRotations(serverHairRotations),

      updateClientCuts: (cuts: boolean[]) => this.socketCallbacks.setRemoteCuts(cuts),
    };

    Object.entries(socketEventHandlers).forEach(([name, handler]) => {
      this.socket.on(name, handler);
    });
  }

  private createSocketEmitters() {
    setInterval(() => {
      const cuts = this.socketCallbacks.sendLocalCuts();
      const hasCuts = cuts.some(Boolean);
      if (hasCuts) this.updateServerCuts(cuts);
    }, Socket.EMIT_INTERVAL);
  }

  private updateServerCuts(cuts: boolean[]) {
    this.socket.emit('updateServerCuts', cuts);
    this.socketCallbacks.sentLocalCuts();
  }
}
