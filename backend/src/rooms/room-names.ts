export const getRandomRoomName = (): string => {
  const first = getRandomElement(firstWord);
  const second = getRandomElement(secondWord);
  const third = getRandomElement(thirdWord);
  const fourth = getRandomElement(fourthWord);

  return `${first}-${second}-${third}-${fourth}`;
};

export const isValidRoomName = (room: string): boolean => {
  const words = room.split('-');

  if (words.length !== 4) return false;

  const [first, second, third, fourth] = room.split('-');

  const validFirst = firstWord.includes(first);
  const validSecond = secondWord.includes(second);
  const validThird = thirdWord.includes(third);
  const validFourth = fourthWord.includes(fourth);

  return validFirst && validSecond && validThird && validFourth;
};

const getRandomElement = <T>(list: T[]) => list[Math.floor(Math.random() * list.length)];

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
  'whiskers',
];
