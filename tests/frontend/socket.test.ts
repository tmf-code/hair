import { FriendPlayers } from './../../src/drivers/player/friend-players';
import { CurrentPlayer } from './../../src/drivers/player/current-player';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/first */
import { ClientSocket, SocketCallbacks } from '../../src/drivers/client-socket';
import { HairLengths } from '../../src/drivers/hairs/hair-lengths';
import { HairCuts } from '../../src/drivers/hairs/hair-cuts';
import { HairPositions } from '../../src/drivers/hairs/hair-positions';
import { HairRotations } from '../../src/drivers/hairs/hair-rotations';

const hairCuts = new HairCuts(0);
const hairLengths = new HairLengths(0);
const hairPositions = new HairPositions(0);
const hairRotations = new HairRotations(0);
const currentPlayer = new CurrentPlayer();
const friendPlayers = new FriendPlayers();

const socketCallbacks: SocketCallbacks = {
  setPositions: hairPositions.setPositions.bind(hairPositions),
  setRotations: hairRotations.setInitialRotations.bind(hairRotations),
  setPlayers: friendPlayers.updatePlayers.bind(friendPlayers),
  setLengths: hairLengths.updateLengths.bind(hairLengths),
  sendLocalCuts: hairCuts.getClientCuts.bind(hairCuts),
  sentLocalCuts: hairCuts.clearClientCuts.bind(hairCuts),
  sendLocation: currentPlayer.getBufferedPlayerData.bind(currentPlayer),
  sentLocation: currentPlayer.clearBufferedPlayerData.bind(currentPlayer),
};

jest.mock('socket.io-client');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const io = require('socket.io-client');

const socketOnMock = jest.fn();
const socketEmitMock = jest.fn();
io.mockImplementation(() => {
  return {
    on: socketOnMock,
    emit: socketEmitMock,
  };
});

describe('Socket Initial state', () => {
  afterEach(() => {
    io.mockClear();
  });

  test('Socket establishes production connection', () => {
    const socket = new ClientSocket(io, 'production', socketCallbacks);
    expect(io).toBeCalled();
  });

  test('Socket has event handlers', () => {
    const eventHandlerNames = [
      'updateClientGrid',
      'updateClientLengths',
      'updateClientRotations',
    ] as const;

    const socket = new ClientSocket(io, 'development', socketCallbacks);

    eventHandlerNames.forEach((handlerName) => {
      expect(socketOnMock).toBeCalledWith(handlerName, expect.any(Function));
    });
  });
});
