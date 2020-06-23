import { ServerSocketOverload } from './socketio-overloads';

export type ClientToServer = {
  connect: ServerSocketOverload;
};

export type ClientToSocket = {
  disconnect: void;
  updateServerCuts: boolean[];
  updatePlayerLocation: BufferedPlayerData;
  requestRoom: string;
};

export type ServerToSocket = {
  connect: void;
  reconnect_attempt;
  updateClientGrid: [number, number][];
  updateClientRotations: number[];
  updateClientLengths: number[];
  updateClientRoom: string;
};

export type ServerToSockets = {
  updatePlayersData: PlayersDataMessage;
};

type PlayerData = {
  rotation: number;
  position: [number, number];
  state: 'CUTTING' | 'NOT_CUTTING';
};

export type BufferedPlayerData = PlayerData[];
export type PlayersDataMessage = Record<string, BufferedPlayerData>;
