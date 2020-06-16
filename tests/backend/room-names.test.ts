import { getRandomRoomName, isValidRoomName } from './../../backend/src/rooms/room-names';
describe('Room names tests', () => {
  test('Can get random room', () => {
    const roomName = getRandomRoomName();
    expect(roomName).toBeDefined();
  });
  test('Room name is valid format', () => {
    const roomName = getRandomRoomName();

    expect(isValidRoomName(roomName)).toBeTruthy();
  });

  test('isValidRoom errors on incorrect name', () => {
    let roomName = 'salty-banana-dinosaur-room';
    expect(isValidRoomName(roomName)).toBeFalsy();

    roomName = '##--precariously-bearded-upper-arm';
    expect(isValidRoomName(roomName)).toBeFalsy();

    roomName = '#precariously-bearded-upper-arm';
    expect(isValidRoomName(roomName)).toBeFalsy();
  });
});
