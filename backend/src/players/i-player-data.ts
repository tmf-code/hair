import { PlayerIdentity, BufferedPlayerData } from '../../../@types/messages';

export interface IplayerData {
  id: PlayerIdentity;
  playerLocations: BufferedPlayerData;
}
