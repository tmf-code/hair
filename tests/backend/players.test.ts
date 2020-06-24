import { createRoomNames } from './fixtures/create-room-names';
import { createSocket } from './fixtures/create-socket';
import { Players } from './../../backend/src/players/players';
import { createIo } from './fixtures/create-io';
const createPlayers = ({
  rooms,
  verbose = false,
}: { rooms?: string[]; verbose?: boolean } = {}) => {
  const io = createIo();
  const getMapState = () => {
    return {
      positions: [],
      lengths: [],
      rotations: [],
    };
  };
  const roomNames = createRoomNames(rooms);
  return new Players({ io, getMapState, roomNames, verbose });
};

describe('Players tests', () => {
  test('Can connect player', () => {
    const players = createPlayers();
    const socket = createSocket();
    players.connectSocket(socket);

    expect(players.connectionCount()).toBe(1);
    expect(players.doesPlayerExist(socket.id)).toBeTruthy();
  });

  test('Can disconnect socket', () => {
    const players = createPlayers();
    const socket = createSocket();
    players.connectSocket(socket);
    players.disconnectSocket(socket);
    expect(players.connectionCount()).toBe(0);
    expect(players.doesPlayerExist(socket.id)).toBeFalsy();
  });

  test('Adding duplicate sockets doesnt create more connections', () => {
    const players = createPlayers();
    const socket = createSocket();
    players.connectSocket(socket);

    expect(players.connectionCount()).toBe(1);
    expect(players.doesPlayerExist(socket.id)).toBeTruthy();
  });

  test('Can remove a non existing socket', () => {
    const players = createPlayers();
    const socket = createSocket();

    expect(() => players.disconnectSocket(socket)).not.toThrow();
  });

  test('Can get player after socket connected', () => {
    const players = createPlayers();
    const socket = createSocket();
    const player = players.connectSocket(socket);

    expect(player.id).toBe(socket.id);
  });

  test('Can add player to random room', () => {
    const players = createPlayers();
    const socket = createSocket();
    const player = players.connectSocket(socket);
    players.addPlayer(socket.id, 'UNDEFINED');

    expect(player.tryGetRoom()).toBeDefined();
  });

  test('Can add player many times without moving', () => {
    const players = createPlayers();
    const socket = createSocket();
    players.connectSocket(socket);
    const firstRoom = players.addPlayer(socket.id, 'UNDEFINED');
    expect(players.addPlayer(socket.id, 'UNDEFINED')).toStrictEqual(firstRoom);
  });

  test('Adding players to invalid rooms places them in a random room', () => {
    const room = 'roomA';
    const players = createPlayers({ rooms: [room] });
    const socket = createSocket();
    const roomName = 'invalid+Room+Name';
    players.connectSocket(socket);
    expect(players.addPlayer(socket.id, roomName)?.name).toBe(room);
  });

  test('Can add player to chosen room', () => {
    const roomNames = ['roomA', 'roomB', 'roomC'];
    const players = createPlayers({ rooms: roomNames, verbose: false });
    const socket = createSocket();
    const player = players.connectSocket(socket);
    const roomName = roomNames[0];
    players.addPlayer(socket.id, roomName);
    expect(player.tryGetRoom()).toBe(roomName);
  });

  test('Can remove player from room', () => {
    const socket = createSocket();
    const players = createPlayers();
    const player = players.connectSocket(socket);
    players.addPlayer(socket.id, 'UNDEFINED');
    players.disconnectSocket(socket);
    expect(player.tryGetRoom()).toBeUndefined();
  });
});
