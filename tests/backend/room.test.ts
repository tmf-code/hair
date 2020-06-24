import { createPlayer } from './create-player';
import { ServerIoOverload } from '../../@types/socketio-overloads';
import { Room } from '../../backend/src/rooms/room';

const createRoom = ({
  name = 'roomOne',
  capacity = 5,
}: {
  name?: string;
  capacity?: number;
} = {}) => {
  jest.mock('socket.io');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const SocketIO = require('socket.io');
  const io = SocketIO() as ServerIoOverload;

  return new Room({ io, name, capacity });
};

describe('Room tests', () => {
  test('Can add player', () => {
    const player = createPlayer('1');
    const room = createRoom();

    room.addPlayer(player);
    expect(room.hasPlayer(player.id)).toBeTruthy();
  });

  test('Can remove player', () => {
    const player = createPlayer('1');
    const room = createRoom();

    room.addPlayer(player);
    room.removePlayer(player.id);
    expect(room.hasPlayer(player.id)).toBeFalsy();
  });

  test('Room can be full', () => {
    const player = createPlayer('1');
    const room = createRoom({ capacity: 1 });

    room.addPlayer(player);
    expect(room.hasPlayer(player.id)).toBeTruthy();
    expect(room.isFull()).toBeTruthy();
  });

  test('Room can be empty', () => {
    const room = createRoom();
    expect(room.isEmpty()).toBeTruthy();
  });

  test('Room cannot add duplicate players', () => {
    const player = createPlayer('1');

    const room = createRoom();
    room.addPlayer(player);

    const addPlayer = () => room.addPlayer(player);

    expect(addPlayer).toThrow();
    expect(room.getSize()).toBe(1);
  });

  test('Room cannot add beyond capacity', () => {
    const player1 = createPlayer('1');
    const player2 = createPlayer('2');

    const room = createRoom({ capacity: 1 });
    room.addPlayer(player1);

    const addPlayer = () => room.addPlayer(player2);
    expect(addPlayer).toThrow();
  });

  test('Room cannot remove unknown player', () => {
    const room = createRoom();

    const removePlayer = () => room.removePlayer('1');
    expect(removePlayer).toThrow();
  });
});
