import { IPlayer } from './i-player';

export class Player implements IPlayer {
  private id: string;

  constructor(id: string) {
    this.id = id;
  }

  getId(): string {
    return this.id;
  }
}
