import { ServerSocketOverload } from './socketio-overloads';

export type ClientToServer = {
  connect: ServerSocketOverload;
};

export type ClientToSocket = {
  disconnect: void;
  updateServerCuts: boolean[];
  updatePlayerLocation: BufferedPlayerData;
};

export type ServerToSocket = {
  connect: void;
  updateClientGrid: [number, number][];
  updateClientRotations: number[];
  updateClientLengths: number[];
};

export type ServerToSockets = {
  updatePlayersData: PlayersDataMessage;
};

type PlayerData = {
  rotation: number;
  position: [number, number];
};

export type PlayerIdentity = string;
export type BufferedPlayerData = PlayerData[];
export type PlayersDataMessage = Record<PlayerIdentity, BufferedPlayerData>;
