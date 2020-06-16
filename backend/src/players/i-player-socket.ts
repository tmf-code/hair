import { IPlayerData } from './i-player-data';
export interface IPlayerSocket {
  getPlayerData(): IPlayerData;
  clearPlayerData(): void;
}
