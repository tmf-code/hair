import { ServerSocket } from './server-socket';
import { makeProductionServer, makeDevelopmentServer } from './server';
import { createGrid } from './create-grid';

let server;

if (process.env.NODE_ENV === 'production') {
  server = makeProductionServer();
  console.log(process.env.NODE_ENV);
} else {
  server = makeDevelopmentServer();
  console.log(process.env.NODE_ENV);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const socket = new ServerSocket(server, createGrid());
