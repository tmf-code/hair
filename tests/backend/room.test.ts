import { createPlayer, generatePlayers } from './create-player';
import { ServerIoOverload } from '../../@types/socketio-overloads';
import { Room } from '../../backend/src/rooms/room';
import { Player } from '../../backend/src/rooms/player';

const createRoom = ({
  name = 'roomOne',
  capacity = 5,
  upgradedCapacity = 20,
}: {
  name?: string;
  capacity?: number;
  upgradedCapacity?: number;
} = {}) => {
  jest.mock('socket.io');
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const SocketIO = require('socket.io');
  const io = SocketIO() as ServerIoOverload;

  return new Room({ io, name, capacity, upgradedCapacity });
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

  test('Room can be upgraded to larger capacity', () => {
    const firstNumberPlayers = 10;
    const secondNumberPlayers = 5;
    const lowCapacity = 5;
    const upgradedCapacity = 10;
    const playerGenerator = generatePlayers();
    const room = createRoom({ capacity: lowCapacity, upgradedCapacity });

    const addFirstPlayers = () => {
      const players = [...new Array(firstNumberPlayers)].map(() => playerGenerator.next().value);
      players.forEach((player) => room.addPlayer(player));
    };

    const addSecondPlayers = () => {
      const players = [...new Array(secondNumberPlayers)].map(() => playerGenerator.next().value);
      players.forEach((player) => room.addPlayer(player));
    };

    expect(room.isUpgraded()).toBeFalsy();
    expect(addFirstPlayers).toThrow();
    expect(room.isFull()).toBeTruthy();
    room.upgrade();
    expect(room.isUpgraded()).toBeTruthy();
    expect(room.isAvailable()).toBeTruthy();
    expect(room.isFull()).toBeFalsy();
    expect(addSecondPlayers).not.toThrow();

    expect(room.isFull()).toBeTruthy();
    expect(room.getSize()).toBe(upgradedCapacity);
  });

  test('Room downgrades if size goes below low capacity', () => {
    const firstNumberPlayers = 10;
    const lowCapacity = 5;
    const upgradedCapacity = 10;
    const playerGenerator = generatePlayers();
    const room = createRoom({ capacity: lowCapacity, upgradedCapacity });
    room.upgrade();

    const players = [...new Array(firstNumberPlayers)].map(() => playerGenerator.next().value);
    players.forEach((player) => room.addPlayer(player));

    expect(room.isFull()).toBeTruthy();
    expect(room.isUpgraded()).toBeTruthy();

    const firstPlayers = players.slice(0, lowCapacity);
    firstPlayers.forEach((player) => room.removePlayer(player.id));

    expect(room.isFull()).toBeTruthy();
    expect(room.isUpgraded()).toBeFalsy();
  });

  test('Can simulating players entering and exiting', () => {
    const simulationTimes = 1000;
    const lowCapacity = 5;
    const upgradedCapacity = 10;
    const playerGenerator = generatePlayers();
    const room = createRoom({ capacity: lowCapacity, upgradedCapacity });

    let addedPlayers: Player[] = [];
    const selectRandom = <T>(list: T[]): T => list[Math.floor(Math.random() * list.length)];

    const simulation = () => {
      for (let simulationStep = 0; simulationStep < simulationTimes; simulationStep++) {
        const shouldAddPlayer = Math.random() < 0.5;
        const shouldRemovePlayer = Math.random() < 0.5;
        const shouldUpgradeRoom = Math.random() < 0.05;

        if (shouldAddPlayer && !room.isFull()) {
          const player = playerGenerator.next().value;
          room.addPlayer(player);
          addedPlayers.push(player);
        }

        if (shouldRemovePlayer && addedPlayers.length > 0) {
          const player = selectRandom(addedPlayers);
          room.removePlayer(player.id);
          addedPlayers = addedPlayers.filter(({ id }) => id !== player.id);
        }

        if (shouldUpgradeRoom) {
          room.upgrade();
        }
      }
    };

    expect(simulation).not.toThrow();
  });
});
