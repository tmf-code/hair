import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

type SocketListener = (position: [number, number][]) => void;

export class Socket {
  static instance = new Socket();

  public listeners: Map<string, SocketListener> = new Map();
  public socket: SocketIOClient.Socket;
  public id: string;

  private constructor() {
    this.id = uuidv4();
    const socket = io('http://192.168.178.41:3001');
    socket.on('connect', () => {});
    socket.on('event', () => {});
    socket.on('disconnect', () => {});
    socket.on('mice', (data: { [key: string]: [number, number] }) => {
      this.updateListeners(Object.values(data));
    });

    socket.emit('setSocketId', this.id);

    this.socket = socket;
  }

  private updateListeners(positions: [number, number][]) {
    this.listeners.forEach((listener) => listener(positions));
  }

  static addListener(name: string, listener: SocketListener) {
    if (this.instance.listeners.has(name)) {
      return;
    }
    this.instance.listeners.set(name, listener);
  }

  static emit(message: 'mouse', data: [number, number]) {
    this.instance.socket.emit(message, { id: this.instance.id, mousePosition: data });
  }
}
