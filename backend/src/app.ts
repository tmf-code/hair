import { Players } from './players/players';
import { widthPoints, heightPoints, jitterRange, rotationStart, rotationEnd } from './constants';
import { HairMapFactory } from './hair-map/hair-map-factory';
import { SocketServer } from './socket-server';
import { makeProductionServer } from './server';
import { RoomNames } from './rooms/room-names';

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
const players = new Players({
  io: socket.io,
  getMapState: hairMap.getMapState.bind(hairMap),
  roomNames: RoomNames.createFromStandardNames(),
  verbose: true,
});
socket.on('playerConnected', (socket) => players.connectSocket(socket));
socket.on('playerDisconnected', (socket) => players.disconnectSocket(socket));
socket.on('receivedCuts', (cuts) => hairMap.receiveCuts(cuts));
socket.on('sendPlayerData', () => players.emitPlayerLocations());
socket.on('requestRoom', ([socket, name]) => players.addPlayer(socket.id, name));
players.setReceiveCuts(socket.receiveCuts.bind(socket));
