import { RoomNames } from './../../../backend/src/rooms/room-names';
export const createRoomNames = (names: string[] = ['roomA', 'roomB', 'roomC']): RoomNames => {
  return new RoomNames(new Set(names));
};
