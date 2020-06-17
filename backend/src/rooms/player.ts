import { IPlayer } from './i-player';

export class Player implements IPlayer {
  readonly id: string;

  constructor(id: string) {
    this.id = id;
  }
}
