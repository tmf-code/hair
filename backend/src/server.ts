import * as http from 'http';
import SocketIO from 'socket.io';
import { createGrid } from './create-grid';
import Express = require('express');

const app = Express();
const server = http.createServer(app);
const io = SocketIO(server);

server.listen(3001);

let { grid, lengths } = createGrid();

io.on('connection', (socket) => {
  // Reset lengths to zero
  lengths = grid.map(() => 0);

  socket.emit('updateClientGrid', grid);
  socket.on('updateServerLengths', (updatedLengths: number[]) => {
    if (updatedLengths.length !== lengths.length) {
      return;
    }
    lengths = updatedLengths;
  });
  // Grow
  setInterval(() => {
    lengths = lengths.map((length) => Math.min(length + 0.0001, 1000));
    socket.emit('updateClientLengths', lengths);
  }, 100);

  socket.on('disconnect', () => console.log('Client disconnected'));
});

// const cellWidth = 0.01 * maxDimension;
// const cellHeight = 0.01 * maxDimension;
// const thickness = 0.003 * maxDimension;
// const positionJitterRange = 0.005 * maxDimension;
// const growthMin = 0.00003 * maxDimension;
// const growthMax = 0.00008 * maxDimension;
// const lengthMin = 0.01 * maxDimension;
// const lengthMax = 0.028 * maxDimension;

// const directionLeft = -0.1;
// const directionRight = 0.8;

// const directions: Vector[] = positions.map(() => [randRange(directionLeft, directionRight), 1]);

// const growthRates = positions.map(() => randRange(growthMin, growthMax));
// const maximumLengths = grid.map(() => randRange(lengthMin, lengthMax));
