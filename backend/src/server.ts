import * as http from 'http';
import SocketIO from 'socket.io';
import { createGrid } from './create-grid';
import { growthSpeed } from './constants';
import Express = require('express');

const app = Express();
const server = http.createServer(app);
const io = SocketIO(server);

server.listen(3001);

let { grid, lengths, rotations } = createGrid();

io.on('connection', (socket) => {
  // Reset lengths to zero
  lengths = grid.map(() => 0);

  socket.emit('updateClientGrid', grid);
  socket.emit('updateClientRotations', rotations);
  socket.on('updateServerLengths', (updatedLengths: number[]) => {
    if (updatedLengths.length !== lengths.length) {
      return;
    }
    lengths = lengths.map((length, lengthIndex) =>
      updatedLengths[lengthIndex] === 0 ? 0 : length,
    );
  });
  // Grow
  setInterval(() => {
    lengths = lengths.map((length) => Math.min(length + growthSpeed, 1));
    if (lengths.some((length) => length !== 1)) {
      socket.emit('updateClientLengths', lengths);
    }
  }, 100);

  socket.on('disconnect', () => console.log('Client disconnected'));
});
