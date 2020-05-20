/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/first */
import { Socket } from '../../src/drivers/Socket';

jest.mock('socket.io-client');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const io = require('socket.io-client');

const socketOnMock = jest.fn();
io.mockImplementation(() => {
  return {
    on: socketOnMock,
  };
});

describe('Socket Initial state', () => {
  afterEach(() => {
    io.mockClear();
  });

  test('Socket establishes production connection', () => {
    const socket = new Socket(io, 'production');
    expect(io).toBeCalledWith();
  });

  test('Socket establishes development connection', () => {
    const socket = new Socket(io, 'development');
    expect(io).toBeCalledWith('http://localhost:3001');
  });

  test('Socket has event handlers', () => {
    const eventHandlerNames = [
      'updateClientGrid',
      'updateClientGrowth',
      'updateClientLengths',
      'updateClientRotations',
      'updateClientCuts',
    ] as const;

    const socket = new Socket(io, 'development');

    eventHandlerNames.forEach((handlerName) => {
      expect(socketOnMock).toBeCalledWith(handlerName, expect.any(Function));
    });
  });
});
