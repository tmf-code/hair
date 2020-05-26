import { createGrid } from './create-grid';
import { growthSpeed, SERVER_EMIT_INTERVAL } from './constants';
import SocketIO from 'socket.io';

const createSocket = (server: import('http').Server) => {
  // eslint-disable-next-line prefer-const
  let { grid, lengths, rotations } = createGrid();
  let cuts = grid.map(() => false);
  const playerLocations: Record<string, { position: [number, number]; rotation: number }> = {};
  const io = SocketIO(server);

  io.on('connection', (socket) => {
    socket.emit('updateClientGrid', grid);
    socket.emit('updateClientRotations', rotations);
    socket.emit('updateClientLengths', lengths);
    socket.on('updateServerCuts', (incomingCuts: boolean[]) => {
      if (incomingCuts.length !== cuts.length) {
        return;
      }
      cuts = cuts.map((currentCut, cutIndex) => currentCut || incomingCuts[cutIndex]);
      lengths = lengths.map((length, lengthIndex) => (incomingCuts[lengthIndex] ? 0 : length));
    });
    socket.on(
      'updatePlayerLocation',
      ({ rotation, position }: { rotation: number; position: [number, number] }) => {
        playerLocations[socket.id] = { rotation, position };
      },
    );
    socket.on('disconnect', () => {
      delete playerLocations[socket.id];
    });
  });

  // Cut
  setInterval(() => {
    if (cuts.some(Boolean)) {
      io.emit('updateClientCuts', cuts);
      cuts = grid.map(() => false);
    }
  }, SERVER_EMIT_INTERVAL);

  // Grow
  setInterval(() => {
    lengths = lengths.map((length) => Math.min(length + growthSpeed, 1));
    io.emit('updateClientGrowth', growthSpeed);
  }, SERVER_EMIT_INTERVAL);

  // Locations
  setInterval(() => {
    io.emit('updateClientPlayerLocations', playerLocations);
  }, SERVER_EMIT_INTERVAL);

  return io;
};

export { createSocket };
