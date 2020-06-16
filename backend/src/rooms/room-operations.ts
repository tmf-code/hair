import { Guest } from './guest';
import {
  NotEmptyRooms,
  PossibleRooms,
  PossibleRoomSizes,
  PossibleRoomMap,
  Upgradable,
  RoomOne,
  RoomEmptied,
} from './room';
import { getRandomRoomName } from './room-names';
export const startRooms = (): readonly NotEmptyRooms[] => [];

export const addGuestToRooms = (
  guest: Guest,
  rooms: readonly NotEmptyRooms[],
): readonly NotEmptyRooms[] => {
  const maybeRoom = tryFindRoomOfGuest(guest, rooms);

  if (maybeRoom !== undefined)
    throw new Error(`Could not add guest. Guest ${guest.id} already exists in rooms`);

  const filledOneRoom = tryFillOneRooms(rooms, guest);
  if (filledOneRoom !== undefined) return filledOneRoom;

  const filledTwoRoom = tryFillTwoRooms(rooms, guest);
  if (filledTwoRoom !== undefined) return filledTwoRoom;

  const filledThreeRoom = tryFillThreeRooms(rooms, guest);
  if (filledThreeRoom !== undefined) return filledThreeRoom;

  return addNewGuestToRooms(rooms, getRandomRoomName(), guest);
};

const tryFillOneRooms = (
  rooms: readonly NotEmptyRooms[],
  guest: Guest,
): readonly NotEmptyRooms[] | undefined => {
  const oneRooms = getOneRooms(rooms);
  if (oneRooms.length === 0) return undefined;

  rooms = addGuestToRoom(rooms, oneRooms[0], guest);
  return rooms;
};

const tryFillTwoRooms = (
  rooms: readonly NotEmptyRooms[],
  guest: Guest,
): readonly NotEmptyRooms[] | undefined => {
  const twoRooms = getTwoRooms(rooms);
  if (twoRooms.length === 0) return undefined;

  return addGuestToRoom(rooms, twoRooms[0], guest);
};

const tryFillThreeRooms = (
  rooms: readonly NotEmptyRooms[],
  guest: Guest,
): readonly NotEmptyRooms[] | undefined => {
  const threeRooms = getThreeRooms(rooms);
  if (threeRooms.length === 0) return undefined;

  return addGuestToRoom(rooms, threeRooms[0], guest);
};

const getOneRooms = (rooms: readonly PossibleRooms[]) => getRoomsWithSize(rooms, 1);
const getTwoRooms = (rooms: readonly PossibleRooms[]) => getRoomsWithSize(rooms, 2);
const getThreeRooms = (rooms: readonly PossibleRooms[]) => getRoomsWithSize(rooms, 3);
const getRoomsWithSize = <TSize extends PossibleRoomSizes>(
  rooms: readonly PossibleRooms[],
  size: TSize,
): readonly PossibleRoomMap[TSize][] =>
  rooms.filter((room) => room.size === size) as PossibleRoomMap[TSize][];

const addGuestToRoom = (
  rooms: readonly NotEmptyRooms[],
  room: NotEmptyRooms & Upgradable,
  guest: Guest,
) => {
  const upgradedRoom = room.getUpgradedRoom(guest);
  rooms = removeRoom(rooms, room);
  rooms = addRoom(rooms, upgradedRoom);
  return rooms;
};

const addNewGuestToRooms = (rooms: readonly NotEmptyRooms[], name: string, guest: Guest) => {
  const room = RoomOne.openRoom(name, guest);
  return addRoom(rooms, room);
};

const tryFindRoomOfGuest = (
  guest: Guest,
  rooms: readonly NotEmptyRooms[],
): NotEmptyRooms | undefined => {
  return rooms.find((room) => room.guests.some((existingGuest) => guest.id === existingGuest.id));
};

export const findRoomOfGuest = (guest: Guest, rooms: readonly NotEmptyRooms[]): NotEmptyRooms => {
  const maybeRoom = tryFindRoomOfGuest(guest, rooms);
  if (maybeRoom === undefined) {
    throw new Error(`Cannot find guest ${guest.id} in rooms ${rooms}. Guest is not in rooms`);
  }
  return maybeRoom;
};

export const removeGuest = (
  guest: Guest,
  rooms: readonly NotEmptyRooms[],
): readonly NotEmptyRooms[] => {
  const maybeRoom = tryFindRoomOfGuest(guest, rooms);

  if (maybeRoom === undefined)
    throw new Error(`Could not remove guest. Guest ${guest.id} does not exist in rooms`);

  return removeGuestFromRoom(rooms, maybeRoom, guest);
};

const removeGuestFromRoom = (
  rooms: readonly NotEmptyRooms[],
  room: NotEmptyRooms,
  guest: Guest,
) => {
  const downgradedRoom = room.getDowngradedRoom(guest);
  const resultRooms = removeRoom(rooms, room);

  if (isEmpty(downgradedRoom)) return resultRooms;

  return addRoom(resultRooms, downgradedRoom);
};

const addRoom = (rooms: readonly NotEmptyRooms[], room: NotEmptyRooms) => {
  return [...rooms, room];
};

const isEmpty = (room: PossibleRooms): room is RoomEmptied => {
  return room.size === 0;
};

const removeRoom = (rooms: readonly NotEmptyRooms[], room: NotEmptyRooms) => {
  return rooms.filter((existingRoom) => existingRoom !== room);
};
