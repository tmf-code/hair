import path from 'path';
import Express = require('express');

const appRoot = process.env.PWD!;
const PORT = process.env.PORT || 3000;

export const makeProductionServer = () => {
  return Express()
    .use(Express.static(path.join(appRoot, 'build')))
    .use(Express.static(appRoot))
    .use((req, res) => res.sendFile(path.join(appRoot, 'build', 'index.html')))
    .listen(PORT, () => console.log(`Production: Listening on ${PORT}`));
};

export const makeDevelopmentServer = () => {
  return Express().listen(3001, () => console.log(`Development: Node Listening on ${3001}`));
};