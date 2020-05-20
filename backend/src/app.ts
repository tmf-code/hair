import { makeProductionServer, makeDevelopmentServer } from './server';
import { createSocket } from './create-socket';

let server;

if (process.env.NODE_ENV === 'production') {
  server = makeProductionServer();
  console.log(process.env.NODE_ENV);
} else {
  server = makeDevelopmentServer();
  console.log(process.env.NODE_ENV);
}

createSocket(server);
