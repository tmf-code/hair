import {
  startRooms,
  addGuestToRooms,
  removeGuest,
  findRoomOfGuest,
} from './../../backend/src/rooms/room-operations';
import type { Guest } from '../../backend/src/rooms/guest';
describe('Room tests', () => {
  test('Can create rooms', () => {
    const rooms = startRooms();
    expect(rooms).toHaveLength(0);
  });

  test('Can add a guest', () => {
    let rooms = startRooms();
    const guest: Guest = {
      id: '0',
    };

    rooms = addGuestToRooms(guest, rooms);
    expect(rooms).toHaveLength(1);
    expect(rooms[0].guests[0].id).toBe(guest.id);
  });

  test('Can remove a guest', () => {
    let rooms = startRooms();
    const guest: Guest = {
      id: '0',
    };

    rooms = addGuestToRooms(guest, rooms);
    rooms = removeGuest(guest, rooms);
    expect(rooms).toHaveLength(0);
  });

  test("Can't add duplicate guests", () => {
    let rooms = startRooms();
    const guest: Guest = {
      id: '0',
    };

    rooms = addGuestToRooms(guest, rooms);
    const testFunction = () => addGuestToRooms(guest, rooms);
    expect(testFunction).toThrow();
  });

  test('Can add many guests and they fill up properly', () => {
    let rooms = startRooms();
    const amount = 8;
    const guests: Guest[] = makeGuests(amount);

    const expectedRoomSizesSequence = [[1], [2], [3], [4], [4, 1], [4, 2], [4, 3], [4, 4]];
    const expectedLengthSequence = [1, 1, 1, 1, 2, 2, 2, 2];

    guests.forEach((guest, index) => {
      rooms = addGuestToRooms(guest, rooms);
      const sizes = rooms.map((room) => room.size);
      expect(rooms).toHaveLength(expectedLengthSequence[index]);
      expect(sizes).toStrictEqual(expectedRoomSizesSequence[index]);
    });
  });

  test('Removing guests closes rooms', () => {
    let rooms = startRooms();
    const amount = 8;
    const guests: Guest[] = makeGuests(amount);
    const expectedRoomSizesSequence = [[], [1], [2], [3], [4], [4, 1], [4, 2], [4, 3]].reverse();
    const expectedLengthSequence = [0, 1, 1, 1, 1, 2, 2, 2].reverse();

    guests.forEach((guest, index) => {
      rooms = addGuestToRooms(guest, rooms);
    });

    guests.forEach((guest, index) => {
      rooms = removeGuest(guest, rooms);
      const sizes = rooms.map((room) => room.size);
      expect(rooms).toHaveLength(expectedLengthSequence[index]);
      expect(sizes).toStrictEqual(expectedRoomSizesSequence[index]);
    });
  });

  test('Randomly adding and removing guests maintains total number of guests', () => {
    let rooms = startRooms();
    const amount = 400;

    const chanceToAdd = 0.5;
    const chanceToRemove = 0.5;

    const guests: Guest[] = makeGuests(amount);

    const expectedGuestsInGame: Guest[] = [];
    const actualGuestsInGame = () =>
      rooms.reduce((acc, currentRoom) => [...acc, ...currentRoom.guests], [] as Guest[]);
    const randomlyAdd = (guest: Guest) => {
      if (Math.random() > chanceToAdd) {
        rooms = addGuestToRooms(guest, rooms);
        expectedGuestsInGame.push(guest);
      }
    };
    const randomlyRemove = () => {
      if (Math.random() > chanceToRemove) {
        const randomGuest =
          expectedGuestsInGame[Math.floor(Math.random() * expectedGuestsInGame.length)];
        if (randomGuest === undefined) return;

        rooms = removeGuest(randomGuest, rooms);
        const maybeIndex = expectedGuestsInGame.findIndex(
          (existingGuest) => randomGuest.id === existingGuest.id,
        );

        expect(maybeIndex).not.toEqual(-1);
        expectedGuestsInGame.splice(maybeIndex, 1);
      }
    };
    guests.forEach((guest, index) => {
      randomlyAdd(guest);
      randomlyRemove();
      expect(actualGuestsInGame()).toHaveLength(expectedGuestsInGame.length);
    });
  });

  test('Can find room of guest', () => {
    const guest: Guest = { id: '0' };
    let rooms = startRooms();
    rooms = addGuestToRooms(guest, rooms);

    const guestsRoom = findRoomOfGuest(guest, rooms);

    expect(guestsRoom).toBeDefined();
    expect(guestsRoom?.guests).toContain(guest);
  });

  test('Guests room never changes', () => {
    const guest: Guest = { id: '0' };
    let rooms = startRooms();
    rooms = addGuestToRooms(guest, rooms);

    const amount = 400;

    const guests: Guest[] = makeGuests(amount, 1);

    const expectedGuestsRoom = findRoomOfGuest(guest, rooms);

    guests.forEach((guest) => {
      rooms = addGuestToRooms(guest, rooms);
    });

    const guestsRoom = findRoomOfGuest(guest, rooms);
    expect(guestsRoom).toBeDefined();
    expect(guestsRoom?.name).toEqual(expectedGuestsRoom?.name);
  });
});

const makeGuests = (amount: number, startIndex = 0) => {
  const guests: Guest[] = [...new Array(amount)].map((_, index) => {
    return {
      id: (index + startIndex).toString(),
    };
  });

  return guests;
};
