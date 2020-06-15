import { getRandomRoomName } from './names';
import { Guest } from './Guest';
export const startRooms = (): readonly NotEmptyRooms[] => [];

export const addGuestToRooms = (
  guest: Guest,
  rooms: readonly NotEmptyRooms[],
): readonly NotEmptyRooms[] => {
  const maybeRoom = findRoomOfGuest(guest, rooms);

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
  rooms = addRoom(rooms, room);
  return rooms;
};

const findRoomOfGuest = (
  guest: Guest,
  rooms: readonly NotEmptyRooms[],
): NotEmptyRooms | undefined => {
  return rooms.find((room) => room.guests.some((existingGuest) => guest.id === existingGuest.id));
};

export const removeGuest = (
  guest: Guest,
  rooms: readonly NotEmptyRooms[],
): readonly NotEmptyRooms[] => {
  const maybeRoom = findRoomOfGuest(guest, rooms);

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

type PossibleRoomSizes = 0 | 1 | 2 | 3 | 4;
type PossibleRooms = RoomEmptied | RoomOne | RoomTwo | RoomThree | RoomFull;
type PossibleRoomMap = [RoomEmptied, RoomOne, RoomTwo, RoomThree, RoomFull];
export type NotEmptyRooms = Exclude<PossibleRooms, RoomEmptied>;

interface Room<T extends number> {
  readonly name: string;
  readonly size: T;
  readonly guests: Guest[];
}

type PossibleUpgradedRooms = RoomOne | RoomTwo | RoomThree | RoomFull;
interface Upgradable {
  getUpgradedRoom(guest: Guest): PossibleUpgradedRooms;
}

type PossibleDowngradedRooms = RoomEmptied | RoomOne | RoomTwo | RoomThree;
interface Downgradable {
  getDowngradedRoom(guest: Guest): PossibleDowngradedRooms;
}

class RoomEmptied implements Room<0> {
  readonly name: string;
  readonly guests: Guest[] = [];
  readonly size: 0 = 0;

  constructor(name: string) {
    this.name = name;
  }
}

class RoomOne implements Room<1>, Upgradable, Downgradable {
  readonly name: string;
  readonly guests: Guest[];
  readonly size: 1 = 1;

  static openRoom(name: string, guest: Guest): RoomOne {
    const emptyRoom = new RoomEmptied(name);
    return new RoomOne(emptyRoom, [guest]);
  }

  constructor(previousRoom: Room<0> | Room<2>, guests: Guest[]) {
    this.name = previousRoom.name;
    this.guests = guests;
  }

  getUpgradedRoom(guest: Guest): RoomTwo {
    const guests = [...this.guests, guest];
    return new RoomTwo(this, guests);
  }

  getDowngradedRoom(guest: Guest): RoomEmptied {
    return new RoomEmptied(this.name);
  }
}

class RoomTwo implements Room<2>, Upgradable, Downgradable {
  readonly name: string;
  readonly guests: Guest[];
  readonly size: 2 = 2;

  constructor(previousRoom: Room<1> | Room<3>, guests: Guest[]) {
    this.name = previousRoom.name;
    this.guests = guests;
  }

  getUpgradedRoom(guest: Guest): RoomThree {
    const guests = [...this.guests, guest];
    return new RoomThree(this, guests);
  }

  getDowngradedRoom(guest: Guest): RoomOne {
    const guests = this.guests.filter((existingGuest) => existingGuest !== guest);
    return new RoomOne(this, guests);
  }
}

class RoomThree implements Room<3>, Upgradable, Downgradable {
  readonly name: string;
  readonly guests: Guest[];
  readonly size: 3 = 3;

  constructor(previousRoom: Room<2> | Room<4>, guests: Guest[]) {
    this.name = previousRoom.name;
    this.guests = guests;
  }

  getUpgradedRoom(guest: Guest): RoomFull {
    const guests = [...this.guests, guest];
    return new RoomFull(this, guests);
  }

  getDowngradedRoom(guest: Guest): RoomTwo {
    const guests = this.guests.filter((existingGuest) => existingGuest !== guest);
    return new RoomTwo(this, guests);
  }
}

class RoomFull implements Room<4>, Downgradable {
  readonly name: string;
  readonly guests: Guest[];
  readonly size: 4 = 4;

  constructor(previousRoom: Room<3>, guests: Guest[]) {
    this.name = previousRoom.name;
    this.guests = guests;
  }

  getDowngradedRoom(guest: Guest): RoomThree {
    const guests = this.guests.filter((existingGuest) => existingGuest !== guest);
    return new RoomThree(this, guests);
  }
}
