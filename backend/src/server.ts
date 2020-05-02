import { createSocket } from './create-socket';
import path from 'path';
import Express = require('express');

const appRoot = process.env.PWD!;
const PORT = process.env.PORT || 3000;

let server;

if (process.env.NODE_ENV === 'production') {
  server = Express()
    .use(Express.static(path.join(appRoot, 'build')))
    .use(Express.static(appRoot))
    .use((req, res) => res.sendFile(path.join(appRoot, 'build', 'index.html')))
    .listen(PORT, () => console.log(`Production: Listening on ${PORT}`));
} else {
  server = Express().listen(3001, () => console.log(`Production: Node Listening on ${3001}`));
}

createSocket(server);
