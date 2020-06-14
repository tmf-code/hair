import { ServerSocketOverload } from './socketio-overloads';

export type ClientToServer = {
  connect: ServerSocketOverload;
};

export type ClientToSocket = {
  disconnect: void;
  updateServerCuts: boolean[];
  updatePlayerLocation: {
    rotation: number;
    position: [number, number];
  }[];
};

export type ServerToSocket = {
  connect: void;
  updateClientGrid: [number, number][];
  updateClientRotations: number[];
  updateClientLengths: number[];
};

export type ServerToSockets = {
  updateClientPlayerLocations: Record<
    string,
    {
      rotation: number;
      position: [number, number];
    }[]
  >;
};
