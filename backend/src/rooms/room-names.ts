const getRandomElement = <T>(list: T[]) => list[Math.floor(Math.random() * list.length)];
export class RoomNames {
  static createFromStandardNames(): RoomNames {
    const aToBCombinations = (a: string[], b: string[]): string[][] =>
      a.map((first) => b.map((second) => first + '-' + second));

    const firstToSecond = aToBCombinations(firstWord, secondWord).flat();
    const firstToThird = aToBCombinations(firstToSecond, thirdWord).flat();
    const firstWordToFourthWord = aToBCombinations(firstToThird, fourthWord).flat();

    return new RoomNames(new Set(firstWordToFourthWord));
  }
  private roomNames: Set<string>;
  private checkedOutRooms: Set<string>;
  private checkedInRooms: Set<string>;
  constructor(roomNames: Set<string>) {
    this.roomNames = roomNames;
    this.checkedOutRooms = new Set();
    this.checkedInRooms = new Set(this.roomNames);
  }

  checkOutRoom(name: string): string {
    this.throwIfInvalid(name);
    this.throwIfCheckedOut(name);
    this.throwIfNotCheckedIn(name);

    this.checkedOutRooms.add(name);
    this.checkedInRooms.delete(name);

    return name;
  }

  checkInRoom(name: string): string {
    this.throwIfInvalid(name);
    this.throwIfCheckedIn(name);
    this.throwIfNotCheckedOut(name);

    this.checkedInRooms.add(name);
    this.checkedOutRooms.delete(name);

    return name;
  }

  getFreeRandomRoomName(): string {
    return getRandomElement([...this.checkedInRooms]);
  }

  private throwIfNotCheckedIn(name: string) {
    if (!this.checkedInRooms.has(name))
      throw new Error(`Could not check out room ${name}. Room isn't checked in.`);
  }
  private throwIfCheckedOut(name: string) {
    if (this.checkedOutRooms.has(name))
      throw new Error(`Could not check out room ${name}. Room is already checked out.`);
  }
  private throwIfCheckedIn(name: string) {
    if (this.checkedInRooms.has(name))
      throw new Error(`Could not check in room ${name}. Room is already checked in.`);
  }

  private throwIfNotCheckedOut(name: string) {
    if (!this.checkedOutRooms.has(name))
      throw new Error(`Could not check in room ${name}. Room isn't checked out.`);
  }
  private throwIfInvalid(name: string) {
    if (!this.roomNames.has(name))
      throw new Error(`Invalid room name ${name}. Does not exist in set`);
  }

  canCheckIn = (room: string): boolean => this.isTaken(room) && this.isValidRoomName(room);
  canCheckOut = (room: string): boolean => this.isFree(room) && this.isValidRoomName(room);
  isTaken = (room: string): boolean => this.checkedOutRooms.has(room);
  isFree = (room: string): boolean => this.checkedInRooms.has(room);
  isValidRoomName = (room: string): boolean => this.roomNames.has(room);
}

const firstWord = [
  'absurdly',
  'annoyingly',
  'awfully',
  'barely',
  'carelessly',
  'cheerfully',
  'clearly',
  'crazily',
  'dramatically',
  'fortunately',
  'frivolously',
  'generously',
  'gently',
  'mildly',
  'obviously',
  'outrageously',
  'practically',
  'precariously',
  'preposterously',
  'pretty',
  'quite',
  'ridiculously',
  'saddeningly',
  'senselessly',
  'shockingly',
  'slightly',
  'smoothly',
  'tediously',
  'unfortunately',
  'utterly',
  'very',
  'wildly',
  'woefully',
];
const secondWord = [
  'bearded',
  'bushy',
  'combed',
  'curly',
  'dirty',
  'dressed',
  'fluffy',
  'furry',
  'greasy',
  'groomed',
  'hairy',
  'hirsute',
  'irresistible',
  'itchy',
  'luring',
  'malting',
  'matted',
  'muscular',
  'prickly',
  'scraggly',
  'scruffy',
  'sensual',
  'shaggy',
  'smooth',
  'soft',
  'stubbly',
  'tangled',
  'trimmed',
  'wild',
  'woolly',
];
const thirdWord = ['lower', 'upper'];
const fourthWord = [
  'abdomen',
  'arm',
  'armpit',
  'back',
  'buttock',
  'calf',
  'chest',
  'chin',
  'crease',
  'fold',
  'forehead',
  'groin',
  'head',
  'hip',
  'knee',
  'leg',
  'leg',
  'lip',
  'midriff',
  'nape',
  'neck',
  'pubis',
  'shoulder',
  'thigh',
  'torso',
  'torso',
  'waist',
  'whisker',
];
