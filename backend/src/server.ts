import * as http from 'http';
import SocketIO from 'socket.io';
import Express = require('express');

const app = Express();
const server = http.createServer(app);
const io = SocketIO(server);

server.listen(3001);

// Create grid
const widthPoints = 20;
const heightPoints = 20;

type Position = [number, number];

const randRange = (minimum: number, maximum: number) =>
  Math.random() * (maximum - minimum) + minimum;

let grid: Position[] = [...new Array(widthPoints * heightPoints)]
  .fill(0)
  .map((_, index) => [Math.floor(index / widthPoints), index % widthPoints])
  .map(([xPosition, yPosition]) => [xPosition / widthPoints, yPosition / heightPoints])
  .map(([xPosition, yPosition]) => {
    let jitter = [randRange(-0.05, 0.05), randRange(-0.05, 0.05)];
    return [xPosition + jitter[0], yPosition + jitter[1]];
  });

let lengths = grid.map(() => 0);

io.on('connection', (socket) => {
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
