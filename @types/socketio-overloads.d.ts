import { ClientToSocket, ServerToSocket, ServerToSockets, ClientToServer } from './messages';

export type ClientSocketOverload = Omit<SocketIOClient.Socket, 'emit' | 'on'> & {
  emit: <T extends keyof ClientToSocket>(
    event: T,
    ...args: [ClientToSocket[T]]
  ) => SocketIOClient.Emitter;
  on: <T extends keyof ServerToSocket | keyof ServerToSockets>(
    event: T,
    listener: (
      ...args: T extends keyof ServerToSocket
        ? [ServerToSocket[T]]
        : T extends keyof ServerToSockets
        ? [ServerToSockets[T]]
        : never
    ) => void,
  ) => SocketIOClient.Emitter;
};

export type ServerIoOverload = Omit<SocketIO.Server, 'on'> & {
  on: <T extends keyof ClientToServer>(
    event: T,
    listener: (...args: [ClientToServer[T]]) => void,
  ) => SocketIO.Namespace;
};

export type ServerSocketOverload = Omit<SocketIO.Socket, 'emit' | 'on'> & {
  emit: <T extends keyof ServerToSocket>(event: T, ...args: [ServerToSocket[T]]) => boolean;
  on: <T extends keyof ClientToSocket>(
    event: T,
    listener: (...args: [ClientToSocket[T]]) => void,
  ) => SocketIO.Socket;
};
