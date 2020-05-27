import { widthPoints, heightPoints, jitterRange, rotationStart, rotationEnd } from './constants';
import { HairMapFactory } from './hair-map/hair-map-factory';
import { ServerSocket } from './server-socket';
import { makeProductionServer, makeDevelopmentServer } from './server';

let server;

if (process.env.NODE_ENV === 'production') {
  server = makeProductionServer();
  console.log(process.env.NODE_ENV);
} else {
  server = makeDevelopmentServer();
  console.log(process.env.NODE_ENV);
}

const mapState = HairMapFactory.createFrom(
  widthPoints,
  heightPoints,
  jitterRange,
  rotationStart,
  rotationEnd,
);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const socket = new ServerSocket(server, mapState);
