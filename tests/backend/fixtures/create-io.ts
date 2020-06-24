import { ServerIoOverload } from '../../../@types/socketio-overloads';

export const createIo = (): ServerIoOverload => {
  jest.mock('socket.io');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const SocketIO = require('socket.io');
  const io = SocketIO() as ServerIoOverload;
  return io;
};
