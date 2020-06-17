import { IPlayer } from './i-player';
export class Player implements IPlayer {
  id: string;
  constructor(id: string) {
    this.id = id;
  }
}
