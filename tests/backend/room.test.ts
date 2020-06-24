import { createIo } from './fixtures/create-io';
import { createPlayer, generatePlayers } from './fixtures/create-player';
import { Room } from '../../backend/src/rooms/room';
import { Player } from '../../backend/src/rooms/player';

const createRoom = ({
  name = 'roomOne',
  lowCapacity = 5,
  highCapacity = 20,
}: {
  name?: string;
  lowCapacity?: number;
  highCapacity?: number;
} = {}) => {
  const io = createIo();
  return new Room({ io, name, lowCapacity, highCapacity });
};

describe('Room tests', () => {
  test('Can add low player', () => {
    const player = createPlayer('1');
    const room = createRoom();

    room.addLowPlayer(player);
    expect(room.hasPlayer(player.id)).toBeTruthy();
  });

  test('Can remove player', () => {
    const player = createPlayer('1');
    const room = createRoom();

    room.addLowPlayer(player);
    room.removePlayer(player.id);
    expect(room.hasPlayer(player.id)).toBeFalsy();
  });

  test('Room can be low full', () => {
    const player = createPlayer('1');
    const room = createRoom({ lowCapacity: 1 });

    room.addLowPlayer(player);
    expect(room.hasPlayer(player.id)).toBeTruthy();
    expect(room.isLowFull()).toBeTruthy();
  });

  test('Room can be high full', () => {
    const player1 = createPlayer('1');
    const player2 = createPlayer('2');
    const room = createRoom({ lowCapacity: 1, highCapacity: 2 });

    room.addHighPlayer(player1);
    room.addHighPlayer(player2);
    expect(room.hasPlayer(player1.id)).toBeTruthy();
    expect(room.hasPlayer(player2.id)).toBeTruthy();
    expect(room.isLowFull()).toBeTruthy();
    expect(room.isHighFull()).toBeTruthy();
  });

  test('Room can be empty', () => {
    const room = createRoom();
    expect(room.isEmpty()).toBeTruthy();
  });

  test('Room cannot add duplicate players', () => {
    const player = createPlayer('1');

    const room = createRoom();
    room.addLowPlayer(player);

    const addPlayer = () => room.addLowPlayer(player);

    expect(addPlayer).toThrow();
    expect(room.getSize()).toBe(1);
  });

  test('Room cannot add beyond low capacity', () => {
    const player1 = createPlayer('1');
    const player2 = createPlayer('2');

    const room = createRoom({ lowCapacity: 1 });
    room.addLowPlayer(player1);

    const addPlayer = () => room.addLowPlayer(player2);
    expect(addPlayer).toThrow();
  });

  test('Room cannot add beyond high capacity', () => {
    const player1 = createPlayer('1');
    const player2 = createPlayer('2');
    const player3 = createPlayer('3');

    const room = createRoom({ lowCapacity: 1, highCapacity: 2 });
    room.addHighPlayer(player1);
    room.addHighPlayer(player2);

    const addPlayer = () => room.addHighPlayer(player3);
    expect(addPlayer).toThrow();
  });

  test('Room can be low full and accept high players', () => {
    const player1 = createPlayer('1');
    const player2 = createPlayer('2');

    const room = createRoom({ lowCapacity: 1, highCapacity: 2 });

    expect(room.isLowAvailable()).toBeFalsy();
    expect(room.isHighAvailable()).toBeFalsy();

    room.addLowPlayer(player1);

    expect(room.isLowFull()).toBeTruthy();
    expect(room.isLowAvailable()).toBeFalsy();

    expect(room.isHighFull()).toBeFalsy();
    expect(room.isHighAvailable()).toBeTruthy();

    room.addHighPlayer(player2);

    expect(room.isHighFull()).toBeTruthy();
    expect(room.isHighAvailable()).toBeFalsy();
  });

  test('Room cannot remove unknown player', () => {
    const room = createRoom();

    const removePlayer = () => room.removePlayer('1');
    expect(removePlayer).toThrow();
  });

  test('Can simulating players entering and exiting', () => {
    const simulationTimes = 1000;
    const lowCapacity = 5;
    const highCapacity = 10;
    const playerGenerator = generatePlayers();
    const room = createRoom({ lowCapacity, highCapacity });

    let addedPlayers: Player[] = [];
    const selectRandom = <T>(list: T[]): T => list[Math.floor(Math.random() * list.length)];

    const simulation = () => {
      for (let simulationStep = 0; simulationStep < simulationTimes; simulationStep++) {
        const shouldAddLowPlayer = Math.random() < 0.5;
        const shouldAddHighPlayer = Math.random() < 0.5;
        const shouldRemovePlayer = Math.random() < 0.5;

        if (shouldAddLowPlayer && !room.isLowFull()) {
          const player = playerGenerator.next().value;
          room.addLowPlayer(player);
          addedPlayers.push(player);
        }

        if (shouldAddHighPlayer && !room.isHighFull()) {
          const player = playerGenerator.next().value;
          room.addHighPlayer(player);
          addedPlayers.push(player);
        }

        if (shouldRemovePlayer && addedPlayers.length > 0) {
          const player = selectRandom(addedPlayers);
          room.removePlayer(player.id);
          addedPlayers = addedPlayers.filter(({ id }) => id !== player.id);
        }
      }
    };

    expect(simulation).not.toThrow();
  });
});
