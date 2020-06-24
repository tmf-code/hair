// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./socket.io-mock.d.ts" />
import MockedSocket from 'socket.io-mock';
import { ServerIoOverload, ServerSocketOverload } from './../../@types/socketio-overloads.d';
import { Rooms, SocketRoomsOptions } from '../../backend/src/rooms/rooms';
import { RoomNames } from '../../backend/src/rooms/room-names';
import { SocketPlayer } from '../../backend/src/rooms/socket-player';

const roomNames = RoomNames.createFromStandardNames();
const playerRoomOptions: SocketRoomsOptions = {
  playerCapacity: 10,
  roomCapacity: 10,
  roomNames: roomNames,
};

const createPlayer = (id: string) => {
  const socket = new MockedSocket() as ServerSocketOverload;
  socket.id = id;
  const player = new SocketPlayer({
    socket,
    lengths: [],
    rotations: [],
    positions: [],
    receiveCuts: () => null,
  });

  return player;
};

jest.mock('socket.io');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const SocketIO = require('socket.io');
const io = SocketIO() as ServerIoOverload;

describe('PlayerRooms tests', () => {
  test('Can create Rooms', () => {
    const rooms = new Rooms(io, playerRoomOptions);

    expect(rooms.getRoomCount()).toBe(0);
    expect(rooms.getPlayerCount()).toBe(0);
  });

  test('Can add player to next room', () => {
    const player = createPlayer('1');
    const rooms = new Rooms(io, { ...playerRoomOptions, roomCapacity: 1 });

    rooms.addToNextRoom(player);

    expect(rooms.getRoomCount()).toBe(1);
    expect(rooms.getPlayerCount()).toBe(1);
  });

  test('Can add two players to next room', () => {
    const player1 = createPlayer('1');
    const player2 = createPlayer('2');
    const rooms = new Rooms(io, playerRoomOptions);

    rooms.addToNextRoom(player1);
    rooms.addToNextRoom(player2);

    expect(rooms.getRoomCount()).toBe(1);
    expect(rooms.getPlayerCount()).toBe(2);
  });

  test('Exceeding room capacity adds another room', () => {
    const roomCapacity = 1;
    const player1 = createPlayer('1');
    const player2 = createPlayer('2');
    const rooms = new Rooms(io, { ...playerRoomOptions, roomCapacity });

    rooms.addToNextRoom(player1);
    rooms.addToNextRoom(player2);

    expect(rooms.getRoomCount()).toBe(2);
    expect(rooms.getPlayerCount()).toBe(2);
  });

  test('Can add many players to next room', () => {
    const playerCount = 10;
    const roomCapacity = 4;
    const players = createAmount(10, (index) => createPlayer(index.toString()));
    const rooms = new Rooms(io, { ...playerRoomOptions, roomCapacity });

    const expectedRoomCount = Math.ceil(playerCount / roomCapacity);
    players.forEach((player) => rooms.addToNextRoom(player));

    expect(rooms.getRoomCount()).toBe(expectedRoomCount);
    expect(rooms.getPlayerCount()).toBe(playerCount);
  });

  test('Adding a player to incorrect room name fails', () => {
    const player = createPlayer('0');
    const roomName = 'ugly-monkey-string';
    const rooms = new Rooms(io, playerRoomOptions);

    const expectToThrow = () => rooms.addToNamedRoom(roomName, player);

    expect(expectToThrow).toThrow();
  });

  test('Can create a specific room with valid name for player', () => {
    const player = createPlayer('0');
    const roomName = roomNames.getFreeRandomRoomName();
    const rooms = new Rooms(io, playerRoomOptions);

    rooms.addToNamedRoom(roomName, player);

    expect(rooms.getRoomCount()).toBe(1);
    expect(rooms.getPlayerCount()).toBe(1);
    expect(rooms.getRoomNameOfPlayer(player.id)).toBe(roomName);
  });

  test('Can add player to an available existing specific room', () => {
    const player1 = createPlayer('1');
    const player2 = createPlayer('2');
    const rooms = new Rooms(io, playerRoomOptions);

    rooms.addToNextRoom(player1);
    const roomName = rooms.getRoomNameOfPlayer(player1.id);

    rooms.addToNamedRoom(roomName, player2);

    expect(rooms.getRoomCount()).toBe(1);
    expect(rooms.getPlayerCount()).toBe(2);
    expect(rooms.getRoomNameOfPlayer(player2.id)).toBe(roomName);
  });

  test('Can add player to a random room if requested room is full', () => {
    const player1 = createPlayer('1');
    const player2 = createPlayer('2');
    const rooms = new Rooms(io, { ...playerRoomOptions, roomCapacity: 1 });

    rooms.addToNextRoom(player1);
    const roomName = rooms.getRoomNameOfPlayer(player1.id);
    rooms.addToNamedRoom(roomName, player2);

    expect(rooms.getRoomCount()).toBe(2);
    expect(rooms.getPlayerCount()).toBe(2);
    expect(rooms.getRoomNameOfPlayer(player2.id)).not.toBe(roomName);
  });

  test('Can add player to a random room if requested room is full', () => {
    const player1 = createPlayer('1');
    const player2 = createPlayer('2');
    const rooms = new Rooms(io, { ...playerRoomOptions, roomCapacity: 1 });

    rooms.addToNextRoom(player1);
    const roomName = rooms.getRoomNameOfPlayer(player1.id);
    rooms.addToNamedRoom(roomName, player2);

    expect(rooms.getRoomCount()).toBe(2);
    expect(rooms.getPlayerCount()).toBe(2);
    expect(rooms.getRoomNameOfPlayer(player2.id)).not.toBe(roomName);
  });

  test('Can remove player from rooms', () => {
    const player1 = createPlayer('1');
    const rooms = new Rooms(io, { ...playerRoomOptions, roomCapacity: 1 });

    rooms.addToNextRoom(player1);
    rooms.removePlayer(player1.id);
    expect(rooms.getPlayerCount()).toBe(0);
  });

  test('Removing a player and leaving an empty room closes the room', () => {
    const player1 = createPlayer('1');
    const player2 = createPlayer('2');
    const player3 = createPlayer('3');
    const rooms = new Rooms(io, { ...playerRoomOptions, roomCapacity: 2 });
    rooms.addToNextRoom(player1);
    rooms.addToNextRoom(player2);
    rooms.addToNextRoom(player3);

    expect(rooms.getRoomCount()).toBe(2);
    expect(rooms.getPlayerCount()).toBe(3);

    rooms.removePlayer(player1.id);
    expect(rooms.getRoomCount()).toBe(2);
    expect(rooms.getPlayerCount()).toBe(2);

    rooms.removePlayer(player3.id);
    expect(rooms.getRoomCount()).toBe(1);
    expect(rooms.getPlayerCount()).toBe(1);

    rooms.removePlayer(player2.id);
    expect(rooms.getRoomCount()).toBe(0);
    expect(rooms.getPlayerCount()).toBe(0);
  });

  test('Removing a non exiting player throws', () => {
    const rooms = new Rooms(io, { ...playerRoomOptions, roomCapacity: 2 });
    const player1 = createPlayer('1');
    expect(() => rooms.removePlayer(player1.id)).toThrow();
  });
});

const createAmount = <T>(amount: number, creator: (index: number) => T): T[] =>
  [...new Array(amount)].map((_, index) => creator(index));
