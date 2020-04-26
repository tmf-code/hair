import io from 'socket.io-client';
import type { Grid } from '../types/types';

type Vector2 = [number, number];

export class Socket {
  public listeners: Map<string, Function[]> = new Map();
  public socket: SocketIOClient.Socket;

  public lengths: number[] = [];
  public grid: Vector2[];
  public rotations: number[] = [];

  public constructor() {
    this.grid = [];
    const socket = io('http://localhost:3001');

    socket.on('updateClientGrid', (grid: Grid) => {
      this.grid = grid;
      this.emit('updateClientGrid', this.grid);
    });
    socket.on('updateClientLengths', (lengths: number[]) => {
      this.lengths = lengths;
      this.emit('updateClientLengths', lengths);
    });
    socket.on('updateClientRotations', (rotations: number[]) => {
      this.rotations = rotations;
      this.emit('updateClientRotations', rotations);
    });

    this.socket = socket;
  }

  emit(event: 'updateClientLengths', data: this['lengths']): void;
  emit(event: 'updateClientRotations', data: this['rotations']): void;
  emit(event: 'updateServerLengths', data: this['lengths']): void;
  emit(event: 'updateClientGrid', data: this['grid']): void;
  emit(event: string, data: any[]) {
    switch (event) {
      case 'updateClientLengths':
        this.listeners.get('updateClientLengths')?.forEach((listener) => listener(data));
        break;
      case 'updateClientRotations':
        this.listeners.get('updateClientRotations')?.forEach((listener) => listener(data));
        break;
      case 'updateClientGrid':
        this.listeners.get('updateClientGrid')?.forEach((listener) => listener(data));
        break;
      case 'updateServerLengths':
        this.listeners.get('updateServerLengths')?.forEach((listener) => listener(data));
        break;
      default:
        break;
    }
  }

  addListener(name: 'updateClientLengths', listener: (data: this['lengths']) => void): void;
  addListener(name: 'updateClientRotations', listener: (data: this['rotations']) => void): void;
  addListener(name: 'updateClientGrid', listener: (data: this['grid']) => void): void;
  addListener(name: string, listener: Function) {
    if (this.listeners.has(name)) {
      console.log('grid');
      const existingListeners = this.listeners.get(name)!;
      this.listeners.set(name, [...existingListeners, listener]);
      return;
    }
    this.listeners.set(name, [listener]);
  }
}

export const socket = new Socket();
