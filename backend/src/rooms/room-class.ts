import { IPlayer } from './i-player';

export class RoomClass {
  name: string;
  players: IPlayer[];
  capacity: number;

  constructor(name: string, firstPlayer: IPlayer, capacity: number) {
    this.name = name;
    this.players = [firstPlayer];
    this.capacity = capacity;
  }

  addPlayer(player: IPlayer): void {
    if (this.isFull())
      throw new Error(`Cannot add player ${player.getId()} to room ${this.name}. Room is full`);

    this.players.push(player);
  }

  removePlayer(player: IPlayer): void {
    const maybePlayerIndex = this.players.findIndex((currentPlayer) => currentPlayer === player);

    const playerNotInRoom = maybePlayerIndex === -1;
    if (playerNotInRoom)
      throw new Error(
        `Cannot remove player ${player.getId()} from room ${
          this.name
        }. Room does not contain player.`,
      );

    this.players.splice(maybePlayerIndex, 1);
  }

  hasPlayer = (player: IPlayer): boolean => this.players.includes(player);
  isAvailable = (): boolean => !this.isFull() && !this.isEmpty();
  isFull = (): boolean => this.players.length >= this.capacity;
  isEmpty = (): boolean => this.players.length === 0;
  getSize = (): number => this.players.length;
  getName = (): string => this.name;
}
