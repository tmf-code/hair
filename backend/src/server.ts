import { createSocket } from './create-socket';
import path from 'path';
import Express = require('express');

const appRoot = process.env.PWD!;
const PORT = process.env.PORT || 3000;

let server;

const makeProductionServer = () => {
  return Express()
    .use(Express.static(path.join(appRoot, 'build')))
    .use(Express.static(appRoot))
    .use((req, res) => res.sendFile(path.join(appRoot, 'build', 'index.html')))
    .listen(PORT, () => console.log(`Production: Listening on ${PORT}`));
};

const makeDevelopmentServer = () => {
  return Express().listen(3001, () => console.log(`Development: Node Listening on ${3001}`));
};

if (process.env.NODE_ENV === 'production') {
  server = makeProductionServer();
} else {
  server = makeDevelopmentServer();
}

createSocket(server);
