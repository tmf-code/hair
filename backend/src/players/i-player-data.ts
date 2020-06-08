export interface IplayerData {
  id: string;
  playerLocations: {
    rotation: number;
    position: [number, number];
  }[];
}
