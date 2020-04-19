import io from 'socket.io-client';

type Position = [number, number];

export class Socket {
  public listeners: Map<string, Function> = new Map();
  public socket: SocketIOClient.Socket;

  public lengths: number[] = [];
  public grid: Position[];

  public constructor() {
    this.grid = [];
    const socket = io('http://192.168.178.41:3001');
    socket.on('connect', () => {});
    socket.on('event', () => {});
    socket.on('disconnect', () => {});

    socket.on('updateClientGrid', (grid: Position[]) => {
      this.grid = grid;
      this.emit('updateClientGrid', this.grid);
    });
    socket.on('updateClientLengths', (lengths: number[]) => {
      this.lengths = lengths;
      this.emit('updateClientLengths', lengths);
    });

    this.socket = socket;
  }

  emit(event: 'updateClientLengths', data: this['lengths']): void;
  emit(event: 'updateServerLengths', data: this['lengths']): void;
  emit(event: 'updateClientGrid', data: this['grid']): void;
  emit(event: string, data: any[]) {
    switch (event) {
      case 'updateClientLengths':
        this.listeners.get('updateClientLengths')?.(data);
        break;
      case 'updateClientGrid':
        this.listeners.get('updateClientGrid')?.(data);
        break;
      case 'updateServerLengths':
        this.listeners.get('updateServerLengths')?.(data);
        break;
      default:
        break;
    }
  }

  addListener(name: 'updateClientLengths', listener: (data: this['lengths']) => void): void;
  addListener(name: 'updateClientGrid', listener: (data: this['grid']) => void): void;
  addListener(name: string, listener: Function) {
    if (this.listeners.has(name)) {
      return;
    }
    this.listeners.set(name, listener);
  }
}
