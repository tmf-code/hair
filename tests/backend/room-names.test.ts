import { RoomNames } from './../../backend/src/rooms/room-names';

const roomNames = RoomNames.createFromStandardNames();
describe('Room names tests', () => {
  test('Can get random room', () => {
    const roomName = roomNames.getFreeRandomRoomName();
    expect(roomName).toBeDefined();
  });

  test('Random room is free', () => {
    const roomName = roomNames.getFreeRandomRoomName();
    expect(roomNames.isFree(roomName)).toBeTruthy();
  });

  test('Random room is not taken', () => {
    const roomName = roomNames.getFreeRandomRoomName();
    expect(roomNames.isTaken(roomName)).toBeFalsy();
  });

  test('Can checkout room', () => {
    const roomName = roomNames.getFreeRandomRoomName();
    expect(() => roomNames.checkOutRoom(roomName)).not.toThrow();

    expect(roomNames.isTaken(roomName)).toBeTruthy();
    expect(roomNames.isFree(roomName)).toBeFalsy();
  });

  test('Can check in room', () => {
    const roomName = roomNames.getFreeRandomRoomName();
    expect(() => roomNames.checkOutRoom(roomName)).not.toThrow();
    expect(() => roomNames.checkInRoom(roomName)).not.toThrow();

    expect(roomNames.isFree(roomName)).toBeTruthy();
    expect(roomNames.isTaken(roomName)).toBeFalsy();
  });

  test('Checkout throws on invalid name', () => {
    expect(() => roomNames.checkOutRoom('a fake name')).toThrow();
  });

  test('Checkout throws on taken name', () => {
    const roomName = roomNames.getFreeRandomRoomName();
    roomNames.checkOutRoom(roomName);
    expect(() => roomNames.checkOutRoom(roomName)).toThrow();
  });

  test('CheckIn throws on invalid name', () => {
    expect(() => roomNames.checkInRoom('a fake name')).toThrow();
  });

  test('CheckIn throws on free name', () => {
    const roomName = roomNames.getFreeRandomRoomName();
    expect(() => roomNames.checkInRoom(roomName)).toThrow();
  });

  test('Room name is valid format', () => {
    const roomName = roomNames.getFreeRandomRoomName();
    expect(roomNames.isValidRoomName(roomName)).toBeTruthy();
  });

  test('isValidRoom errors on incorrect name', () => {
    let roomName = 'salty-banana-dinosaur-room';
    expect(roomNames.isValidRoomName(roomName)).toBeFalsy();

    roomName = '##--precariously-bearded-upper-arm';
    expect(roomNames.isValidRoomName(roomName)).toBeFalsy();

    roomName = '#precariously-bearded-upper-arm';
    expect(roomNames.isValidRoomName(roomName)).toBeFalsy();
  });

  test('Can use canCheckIn', () => {
    let roomName = 'invalid-room-name';
    expect(roomNames.canCheckIn(roomName)).toBeFalsy();
    expect(roomNames.canCheckOut(roomName)).toBeFalsy();

    roomName = roomNames.getFreeRandomRoomName();
    expect(roomNames.canCheckIn(roomName)).toBeFalsy();
    expect(roomNames.canCheckOut(roomName)).toBeTruthy();

    roomNames.checkOutRoom(roomName);
    expect(roomNames.canCheckIn(roomName)).toBeTruthy();
    expect(roomNames.canCheckOut(roomName)).toBeFalsy();

    roomNames.checkInRoom(roomName);
    expect(roomNames.canCheckIn(roomName)).toBeFalsy();
    expect(roomNames.canCheckOut(roomName)).toBeTruthy();
  });
});
