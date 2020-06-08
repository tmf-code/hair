import { emitInterval } from './../utilities/constants';
export type SocketCallbacks = {
  setPositions: (positions: [number, number][]) => void;
  setRotations: (rotations: number[]) => void;
  setPlayers: (
    playerData: Record<number, { rotation: number; position: [number, number] }[]>,
  ) => void;
  setLengths: (lengths: number[]) => void;
  tickGrowth: (growthSpeed: number) => void;
  setRemoteCuts: (cuts: boolean[]) => void;
  sendLocalCuts: () => boolean[];
  sentLocalCuts: () => void;
  sendLocation: () => { rotation: number; position: [number, number] }[];
};

export class ClientSocket {
  private socket: SocketIOClient.Socket;
  private socketCallbacks: SocketCallbacks;
  private clientID = '';

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
    return mode === 'production' ? io() : io('http://192.168.178.41:3001');
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

      updateClientPlayerLocations: (
        playerData: Record<string, { rotation: number; position: [number, number] }[]>,
      ) => {
        if (playerData !== null) {
          if (playerData[this.clientID] !== undefined) {
            delete playerData[this.clientID];
          }
          this.socketCallbacks.setPlayers(playerData);
        }
      },
    };

    Object.entries(socketEventHandlers).forEach(([name, handler]) => {
      this.socket.on(name, handler);
    });

    this.socket.on('connect', () => {
      this.clientID = this.socket.id;
    });
  }

  private createSocketEmitters() {
    setInterval(() => {
      const cuts = this.socketCallbacks.sendLocalCuts();
      const hasCuts = cuts.some(Boolean);
      if (hasCuts) this.updateServerCuts(cuts);

      const location = this.socketCallbacks.sendLocation();
      this.updatePlayerLocation(location);
    }, emitInterval);
  }

  private updateServerCuts(cuts: boolean[]) {
    this.socket.emit('updateServerCuts', cuts);
    this.socketCallbacks.sentLocalCuts();
  }

  private updatePlayerLocation(location: { rotation: number; position: [number, number] }[]) {
    this.socket.emit('updatePlayerLocation', location);
  }
}
