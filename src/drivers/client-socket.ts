import { BufferedPlayerData } from './../../@types/messages.d';
import { ClientSocketOverload } from './../../@types/socketio-overloads.d';
import { emitInterval } from './../utilities/constants';
import { PlayersDataMessage } from '../../@types/messages';
export type SocketCallbacks = {
  setPositions: (positions: [number, number][]) => void;
  setRotations: (rotations: number[]) => void;
  setPlayers: (playerData: PlayersDataMessage) => void;
  setLengths: (lengths: number[]) => void;
  sendLocalCuts: () => boolean[];
  sentLocalCuts: () => void;
  sendLocation: () => BufferedPlayerData;
  sentLocation: () => void;
};

export class ClientSocket {
  private socket: ClientSocketOverload;
  private socketCallbacks: SocketCallbacks;
  private clientID = '';
  private serverSetHashTo = '';

  constructor(io: SocketIOClientStatic, mode: string, socketCallbacks: SocketCallbacks) {
    if (this.validateMode(mode)) {
      this.socket = this.connectSocket(io, mode);
      this.attachSocketHandlers();
      this.createSocketEmitters();
      this.enterFirstRoom();
      window.addEventListener('hashchange', (event) => this.requestRoom(event));
    } else {
      throw new Error(`Mode should be either 'production' or 'development', got ${mode}`);
    }

    this.socketCallbacks = socketCallbacks;
  }

  private requestRoom(event: HashChangeEvent) {
    if (event.oldURL === event.newURL) return;
    const requestedRoom = window.location.hash.replace('#', '');
    if (requestedRoom === this.serverSetHashTo.replace('#', '')) return;

    this.socket.emit('requestRoom', requestedRoom);
  }

  private enterFirstRoom() {
    const requestedRoom = window.location.hash.replace('#', '');
    this.socket.emit('requestRoom', requestedRoom);
  }

  private validateMode(mode: string): mode is 'production' | 'development' {
    if (mode !== 'production' && mode !== 'development') return false;
    return true;
  }

  private connectSocket(io: SocketIOClientStatic, mode: 'production' | 'development') {
    const options: SocketIOClient.ConnectOpts = {
      transports: ['websocket'],
    };
    return (mode === 'production'
      ? io(options)
      : io('http://192.168.178.41:8080', options)) as ClientSocketOverload;
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

    this.socket.on('updateClientRoom', (room: string) => {
      if (`#${room}` === window.location.hash) return;
      window.location.hash = `#${room}`;
      this.serverSetHashTo = `#${room}`;
    });

    this.socket.on('updatePlayersData', (playerData: PlayersDataMessage) => {
      if (playerData !== null) {
        if (playerData[this.clientID] !== undefined) {
          delete playerData[this.clientID];
        }
        this.socketCallbacks.setPlayers(playerData);
      }
    });

    this.socket.on('connect', () => {
      this.clientID = this.socket.id;
    });

    // on reconnection, reset the transports option, as the Websocket
    // connection may have failed (caused by proxy, firewall, browser, ...)
    this.socket.on('reconnect_attempt', () => {
      this.socket.io.opts.transports = ['polling', 'websocket'];
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

  private updatePlayerLocation(location: BufferedPlayerData) {
    if (location.length !== 0) {
      this.socket.emit('updatePlayerLocation', location);
    }

    this.socketCallbacks.sentLocation();
  }
}
