import path from 'path';
import Express from 'express';
import { Server } from 'http';

const appRoot = process.env.PWD;

if (appRoot === undefined) {
  throw new Error('process.env.PWD not exposed to server');
}

const PORT = process.env.PORT || 8080;

export const makeProductionServer = (): Server => {
  return Express()
    .use(Express.static(path.join(appRoot, 'build')))
    .use(Express.static(appRoot))
    .use((req, res) => res.sendFile(path.join(appRoot, 'build', 'index.html')))
    .listen(PORT, () => console.log(`${process.env.NODE_ENV}: Listening on ${PORT}`));
};
