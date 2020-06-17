import { Players } from './players/players';
import { widthPoints, heightPoints, jitterRange, rotationStart, rotationEnd } from './constants';
import { HairMapFactory } from './hair-map/hair-map-factory';
import { SocketServer } from './socket-server';
import { makeProductionServer } from './server';

const server = makeProductionServer();

const hairMap = HairMapFactory.createFrom(
  widthPoints,
  heightPoints,
  jitterRange,
  rotationStart,
  rotationEnd,
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const socket = new SocketServer(server);
const players = new Players(socket.io, hairMap.getMapState.bind(hairMap));
socket.on('playerConnected', (socket) => players.addPlayer(socket));
socket.on('playerDisconnected', (socket) => players.removePlayer(socket));
socket.on('receivedCuts', (cuts) => hairMap.receiveCuts(cuts));
socket.on('sendPlayerData', () => players.emitPlayerLocations());
players.setReceiveCuts(socket.receiveCuts.bind(socket));
