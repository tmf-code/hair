import { createSocket } from './create-socket';
import { Player } from '../../../backend/src/rooms/player';

export const createPlayer = (id: string): Player => {
  const socket = createSocket(id);
  const player = new Player({
    socket,
    lengths: [],
    rotations: [],
    positions: [],
    receiveCuts: () => null,
  });

  return player;
};

export const generatePlayers = function* (): Generator<Player, never, unknown> {
  let playerIndex = 0;
  while (true) {
    playerIndex++;
    yield createPlayer(playerIndex.toString());
  }
};
