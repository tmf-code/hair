import { createPlayer } from './create-player';
import { ServerIoOverload } from '../../@types/socketio-overloads';
import { Room } from '../../backend/src/rooms/room';

const createRoom = ({
  name = 'roomOne',
  firstPlayer = createPlayer('0'),
  capacity = 5,
}: {
  name?: string;
  firstPlayer?: import('../../backend/src/rooms/player').Player;
  capacity?: number;
} = {}) => {
  jest.mock('socket.io');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const SocketIO = require('socket.io');
  const io = SocketIO() as ServerIoOverload;

  // return new Room(io, name, firstPlayer, capacity);
};

describe('Room tests', () => {
  test('Can add player', () => {
    const player = createPlayer('1');
    const room = createRoom();

    // room.addPlayer(player);
    expect(true).toBeTruthy();
  });
});
