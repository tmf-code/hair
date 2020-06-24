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
  test('Can add player', () => {
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

  test('Room can be full', () => {
    const player = createPlayer('1');
    const room = createRoom({ lowCapacity: 1 });

    room.addLowPlayer(player);
    expect(room.hasPlayer(player.id)).toBeTruthy();
    expect(room.isLowFull()).toBeTruthy();
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

  test('Room cannot add beyond capacity', () => {
    const player1 = createPlayer('1');
    const player2 = createPlayer('2');

    const room = createRoom({ lowCapacity: 1 });
    room.addLowPlayer(player1);

    const addPlayer = () => room.addLowPlayer(player2);
    expect(addPlayer).toThrow();
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
        const shouldAddPlayer = Math.random() < 0.5;
        const shouldRemovePlayer = Math.random() < 0.5;

        if (shouldAddPlayer && !room.isLowFull()) {
          const player = playerGenerator.next().value;
          room.addLowPlayer(player);
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
