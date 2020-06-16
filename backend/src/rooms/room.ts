import { Guest } from './guest';

export type PossibleRoomSizes = 0 | 1 | 2 | 3 | 4;
export type PossibleRooms = RoomEmptied | RoomOne | RoomTwo | RoomThree | RoomFull;
export type PossibleRoomMap = [RoomEmptied, RoomOne, RoomTwo, RoomThree, RoomFull];
export type NotEmptyRooms = Exclude<PossibleRooms, RoomEmptied>;

interface Room<T extends number> {
  readonly name: string;
  readonly size: T;
  readonly guests: Guest[];
}

type PossibleUpgradedRooms = RoomOne | RoomTwo | RoomThree | RoomFull;
export interface Upgradable {
  getUpgradedRoom(guest: Guest): PossibleUpgradedRooms;
}

type PossibleDowngradedRooms = RoomEmptied | RoomOne | RoomTwo | RoomThree;
export interface Downgradable {
  getDowngradedRoom(guest: Guest): PossibleDowngradedRooms;
}

export class RoomEmptied implements Room<0> {
  readonly name: string;
  readonly guests: Guest[] = [];
  readonly size: 0 = 0;

  constructor(name: string) {
    this.name = name;
  }
}

export class RoomOne implements Room<1>, Upgradable, Downgradable {
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

  getDowngradedRoom(): RoomEmptied {
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
