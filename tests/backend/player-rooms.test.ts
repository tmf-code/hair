import { RoomNames } from '../../backend/src/rooms/room-names';
import { PlayerRoomsOptions } from '../../backend/src/rooms/player-rooms';
import { Player } from '../../backend/src/rooms/player';
import { PlayerRooms } from '../../backend/src/rooms/player-rooms';

const roomNames = RoomNames.createFromStandardNames();
const playerRoomOptions: PlayerRoomsOptions = {
  playerCapacity: 10,
  roomCapacity: 10,
  roomNames: roomNames,
};
describe('PlayerRooms tests', () => {
  test('Can create Rooms', () => {
    const rooms = new PlayerRooms(playerRoomOptions);

    expect(rooms.getRoomCount()).toBe(0);
    expect(rooms.getPlayerCount()).toBe(0);
  });

  test('Can add player to next room', () => {
    const player = new Player('0');
    const rooms = new PlayerRooms({ ...playerRoomOptions, roomCapacity: 1 });

    rooms.addToNextRoom(player);

    expect(rooms.getRoomCount()).toBe(1);
    expect(rooms.getPlayerCount()).toBe(1);
  });

  test('Can add two players to next room', () => {
    const player1 = new Player('1');
    const player2 = new Player('2');
    const rooms = new PlayerRooms(playerRoomOptions);

    rooms.addToNextRoom(player1);
    rooms.addToNextRoom(player2);

    expect(rooms.getRoomCount()).toBe(1);
    expect(rooms.getPlayerCount()).toBe(2);
  });

  test('Exceeding room capacity adds another room', () => {
    const roomCapacity = 1;
    const player1 = new Player('1');
    const player2 = new Player('2');
    const rooms = new PlayerRooms({ ...playerRoomOptions, roomCapacity });

    rooms.addToNextRoom(player1);
    rooms.addToNextRoom(player2);

    expect(rooms.getRoomCount()).toBe(2);
    expect(rooms.getPlayerCount()).toBe(2);
  });

  test('Can add many players to next room', () => {
    const playerCount = 10;
    const roomCapacity = 4;
    const players = createAmount(10, (index) => new Player(index.toString()));
    const rooms = new PlayerRooms({ ...playerRoomOptions, roomCapacity });

    const expectedRoomCount = Math.ceil(playerCount / roomCapacity);
    players.forEach((player) => rooms.addToNextRoom(player));

    expect(rooms.getRoomCount()).toBe(expectedRoomCount);
    expect(rooms.getPlayerCount()).toBe(playerCount);
  });

  test('Adding a player to incorrect room name fails', () => {
    const player = new Player('0');
    const roomName = 'ugly-monkey-string';
    const rooms = new PlayerRooms(playerRoomOptions);

    const expectToThrow = () => rooms.addToNamedRoom(roomName, player);

    expect(expectToThrow).toThrow();
  });

  test('Can create a specific room with valid name for player', () => {
    const player = new Player('0');
    const roomName = roomNames.getFreeRandomRoomName();
    const rooms = new PlayerRooms(playerRoomOptions);

    rooms.addToNamedRoom(roomName, player);

    expect(rooms.getRoomCount()).toBe(1);
    expect(rooms.getPlayerCount()).toBe(1);
    expect(rooms.getRoomNameOfPlayer(player)).toBe(roomName);
  });

  test('Can add player to an available existing specific room', () => {
    const player1 = new Player('1');
    const player2 = new Player('2');
    const rooms = new PlayerRooms(playerRoomOptions);

    rooms.addToNextRoom(player1);
    const roomName = rooms.getRoomNameOfPlayer(player1);

    rooms.addToNamedRoom(roomName, player2);

    expect(rooms.getRoomCount()).toBe(1);
    expect(rooms.getPlayerCount()).toBe(2);
    expect(rooms.getRoomNameOfPlayer(player2)).toBe(roomName);
  });

  test('Can add player to a random room if requested room is full', () => {
    const player1 = new Player('1');
    const player2 = new Player('2');
    const rooms = new PlayerRooms({ ...playerRoomOptions, roomCapacity: 1 });

    rooms.addToNextRoom(player1);
    const roomName = rooms.getRoomNameOfPlayer(player1);
    rooms.addToNamedRoom(roomName, player2);

    expect(rooms.getRoomCount()).toBe(2);
    expect(rooms.getPlayerCount()).toBe(2);
    expect(rooms.getRoomNameOfPlayer(player2)).not.toBe(roomName);
  });

  test('Can add player to a random room if requested room is full', () => {
    const player1 = new Player('1');
    const player2 = new Player('2');
    const rooms = new PlayerRooms({ ...playerRoomOptions, roomCapacity: 1 });

    rooms.addToNextRoom(player1);
    const roomName = rooms.getRoomNameOfPlayer(player1);
    rooms.addToNamedRoom(roomName, player2);

    expect(rooms.getRoomCount()).toBe(2);
    expect(rooms.getPlayerCount()).toBe(2);
    expect(rooms.getRoomNameOfPlayer(player2)).not.toBe(roomName);
  });

  test('Can remove player from rooms', () => {
    const player1 = new Player('1');
    const rooms = new PlayerRooms({ ...playerRoomOptions, roomCapacity: 1 });

    rooms.addToNextRoom(player1);
    rooms.removePlayer(player1);
    expect(rooms.getPlayerCount()).toBe(0);
  });

  test('Removing a player and leaving an empty room closes the room', () => {
    const player1 = new Player('1');
    const player2 = new Player('2');
    const player3 = new Player('3');
    const rooms = new PlayerRooms({ ...playerRoomOptions, roomCapacity: 2 });
    rooms.addToNextRoom(player1);
    rooms.addToNextRoom(player2);
    rooms.addToNextRoom(player3);

    expect(rooms.getRoomCount()).toBe(2);
    expect(rooms.getPlayerCount()).toBe(3);

    rooms.removePlayer(player1);
    expect(rooms.getRoomCount()).toBe(2);
    expect(rooms.getPlayerCount()).toBe(2);

    rooms.removePlayer(player3);
    expect(rooms.getRoomCount()).toBe(1);
    expect(rooms.getPlayerCount()).toBe(1);

    rooms.removePlayer(player2);
    expect(rooms.getRoomCount()).toBe(0);
    expect(rooms.getPlayerCount()).toBe(0);
  });

  test('Removing a non exiting player throws', () => {
    const rooms = new PlayerRooms({ ...playerRoomOptions, roomCapacity: 2 });
    const player1 = new Player('1');
    expect(() => rooms.removePlayer(player1)).toThrow();
  });
});

const createAmount = <T>(amount: number, creator: (index: number) => T): T[] =>
  [...new Array(amount)].map((_, index) => creator(index));
