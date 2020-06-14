import { ClientSocketOverload } from './../../@types/socketio-overloads.d';
import { emitInterval } from './../utilities/constants';
type SocketCallbacks = {
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
  private socket: ClientSocketOverload;
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
    return (mode === 'production'
      ? io()
      : io('http://192.168.178.41:3001')) as ClientSocketOverload;
  }

  private attachSocketHandlers() {
    this.socket.on('updateClientGrid', (serverHairPositions: [number, number][]) =>
      this.socketCallbacks.setPositions(serverHairPositions),
    );

    this.socket.on('updateClientLengths', (serverHairLengths: number[]) =>
      this.socketCallbacks.setLengths(serverHairLengths),
    );

    this.socket.on('updateClientRotations', (serverHairRotations: number[]) =>
      this.socketCallbacks.setRotations(serverHairRotations),
    );

    this.socket.on(
      'updateClientPlayerLocations',
      (playerData: Record<string, { rotation: number; position: [number, number] }[]>) => {
        if (playerData !== null) {
          if (playerData[this.clientID] !== undefined) {
            delete playerData[this.clientID];
          }
          this.socketCallbacks.setPlayers(playerData);
        }
      },
    );

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
