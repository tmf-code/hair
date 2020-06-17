import { ServerSocketOverload } from '../../@types/socketio-overloads';
import { Players } from './players/players';
import { widthPoints, heightPoints, jitterRange, rotationStart, rotationEnd } from './constants';
import { HairMapFactory } from './hair-map/hair-map-factory';
import { SocketServer, ServerSocketCallbacks } from './socket-server';
import { makeProductionServer } from './server';

const server = makeProductionServer();

const hairMap = HairMapFactory.createFrom(
  widthPoints,
  heightPoints,
  jitterRange,
  rotationStart,
  rotationEnd,
);

const players = new Players(hairMap.getMapState.bind(hairMap));

const serverSocketCallbacks: ServerSocketCallbacks = {
  onPlayerConnected: (socket: ServerSocketOverload) => {
    return players.addPlayer(socket);
  },
  onPlayerDisconnected: (socket: ServerSocketOverload) => {
    return players.removePlayer(socket);
  },

  onEmitPlayerData: () => {
    return [players.getPlayerData(), players.getPlayerIdPerRoom()];
  },

  onSentPlayerData: () => {
    players.clearPlayerData();
  },

  onReceiveCuts: (cuts: boolean[]) => hairMap.receiveCuts(cuts),
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const socket = new SocketServer(server, serverSocketCallbacks);

players.setReceiveCuts(socket.receiveCuts.bind(socket));
