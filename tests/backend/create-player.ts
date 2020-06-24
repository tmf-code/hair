// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./socket.io-mock.d.ts" />
import MockedSocket from 'socket.io-mock';
import { Player } from '../../backend/src/rooms/player';
import { ServerSocketOverload } from '../../@types/socketio-overloads';

export const createPlayer = (id: string): Player => {
  const socket = new MockedSocket() as ServerSocketOverload;
  socket.id = id;
  const player = new Player({
    socket,
    lengths: [],
    rotations: [],
    positions: [],
    receiveCuts: () => null,
  });

  return player;
};
