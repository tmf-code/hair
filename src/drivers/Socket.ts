import io from 'socket.io-client';
import type { Grid, HairLengths } from '../types/types';

type Vector2 = [number, number];

export class Socket {
  public listeners: Map<string, Function[]> = new Map();
  public socket: SocketIOClient.Socket;

  public lengths: number[] = [];
  public grid: Vector2[];
  public rotations: number[] = [];

  private myCuts: boolean[] = [];

  public constructor() {
    this.grid = [];
    const socket = process.env.NODE_ENV === 'production' ? io() : io('http://192.168.178.41:3001');

    socket.on('updateClientGrid', (grid: Grid) => {
      this.grid = grid;
    });

    socket.on('updateClientGrowth', (growthSpeed: number) => {
      this.lengths = this.lengths.map((length) => Math.min(length + growthSpeed, 1));
    });

    socket.on('updateClientLengths', (lengths: HairLengths) => {
      this.lengths = lengths;
    });

    socket.on('updateClientRotations', (rotations: number[]) => {
      this.rotations = rotations;
    });

    socket.on('updateClientCuts', (cuts: boolean[]) => {
      this.lengths = this.lengths.map((length, lengthIndex) => (cuts[lengthIndex] ? 0 : length));
    });

    setInterval(() => {
      if (this.myCuts.some(Boolean)) {
        socket.emit('updateServerCuts', this.myCuts);
        this.myCuts = this.myCuts.map(() => false);
      }
    }, 100);

    this.socket = socket;
  }

  updateCuts(cuts: boolean[]) {
    this.lengths = this.lengths.map((length, lengthIndex) => (cuts[lengthIndex] ? 0 : length));
    this.myCuts = cuts.map((currentCut, cutIndex) => currentCut || this.myCuts[cutIndex]);
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
