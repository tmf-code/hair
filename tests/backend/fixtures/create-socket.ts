// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./socket.io-mock.d.ts" />
import { ServerSocketOverload } from '../../../@types/socketio-overloads';
import MockedSocket from 'socket.io-mock';

export const createSocket = (id = '1'): ServerSocketOverload => {
  const socket = new MockedSocket() as ServerSocketOverload;
  socket.id = id;

  return socket;
};
