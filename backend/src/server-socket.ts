import { growthSpeed, SERVER_EMIT_INTERVAL } from './constants';
import SocketIO from 'socket.io';

export class ServerSocket {
  private io: SocketIO.Server;
  private lengths: number[];
  private rotations: number[];
  private grid: [number, number][];
  private cuts: boolean[];
  private playerLocations: Record<string, { position: [number, number]; rotation: number }>;

  constructor(
    server: import('http').Server,
    {
      lengths,
      rotations,
      grid,
    }: { lengths: number[]; rotations: number[]; grid: [number, number][] },
  ) {
    this.io = SocketIO(server);

    this.grid = grid;
    this.lengths = lengths;
    this.rotations = rotations;
    this.cuts = grid.map(() => false);

    this.playerLocations = {};

    this.attachSocketServerHandlers();
    this.createSocketServerEmitters();
  }

  private attachSocketServerHandlers() {
    this.io.on('connect', (socket) => {
      this.attachSocketHandlers(socket);
      this.createSocketEmitters(socket);
    });
  }

  private attachSocketHandlers(socket: SocketIO.Socket) {
    const socketEventHandlers = {
      updateServerCuts: (incomingCuts: boolean[]) => {
        if (incomingCuts.length !== this.cuts.length) {
          return;
        }
        this.cuts = this.cuts.map((currentCut, cutIndex) => currentCut || incomingCuts[cutIndex]);
        this.lengths = this.lengths.map((length, lengthIndex) =>
          incomingCuts[lengthIndex] ? 0 : length,
        );
      },

      updatePlayerLocation: ({
        rotation,
        position,
      }: {
        rotation: number;
        position: [number, number];
      }) => {
        this.playerLocations[socket.id] = { rotation, position };
      },
      disconnect: () => {
        delete this.playerLocations[socket.id];
      },
    };

    Object.entries(socketEventHandlers).forEach(([name, handler]) => {
      socket.on(name, handler);
    });
  }

  private createSocketEmitters(socket: SocketIO.Socket) {
    socket.emit('updateClientGrid', this.grid);
    socket.emit('updateClientRotations', this.rotations);
    socket.emit('updateClientLengths', this.lengths);
  }

  private createSocketServerEmitters() {
    setInterval(() => {
      if (this.cuts.some(Boolean)) {
        this.io.emit('updateClientCuts', this.cuts);
        this.cuts = this.grid.map(() => false);
      }
    }, SERVER_EMIT_INTERVAL);

    // Grow
    setInterval(() => {
      this.lengths = this.lengths.map((length) => Math.min(length + growthSpeed, 1));
      this.io.emit('updateClientGrowth', growthSpeed);
    }, SERVER_EMIT_INTERVAL);

    // Locations
    setInterval(() => {
      this.io.emit('updateClientPlayerLocations', this.playerLocations);
    }, SERVER_EMIT_INTERVAL);
  }
}
