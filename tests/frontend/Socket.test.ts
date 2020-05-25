/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/first */
import { Socket, SocketCallbacks } from '../../src/drivers/Socket';
import { HairLengths } from '../../src/drivers/HairLengths';
import { HairCuts } from '../../src/drivers/HairCuts';
import { HairPositions } from '../../src/drivers/HairPositions';
import { HairRotations } from '../../src/drivers/HairRotations';

const hairCuts = new HairCuts(0);
const hairLengths = new HairLengths(0);
const hairPositions = new HairPositions();
const hairRotations = new HairRotations(0);

const socketCallbacks: SocketCallbacks = {
  setPositions: hairPositions.setPositions.bind(hairPositions),
  setRotations: hairRotations.setInitialRotations.bind(hairRotations),
  setLengths: hairLengths.updateLengths.bind(hairLengths),
  tickGrowth: hairLengths.grow.bind(hairLengths),
  setRemoteCuts: hairCuts.addFromServer.bind(hairCuts),
  sendLocalCuts: hairCuts.getClientCuts.bind(hairCuts),
  sentLocalCuts: hairCuts.clearClientCuts.bind(hairCuts),
};

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
    const socket = new Socket(io, 'production', socketCallbacks);
    expect(io).toBeCalledWith();
  });

  test('Socket establishes development connection', () => {
    const socket = new Socket(io, 'development', socketCallbacks);
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

    const socket = new Socket(io, 'development', socketCallbacks);

    eventHandlerNames.forEach((handlerName) => {
      expect(socketOnMock).toBeCalledWith(handlerName, expect.any(Function));
    });
  });
});
