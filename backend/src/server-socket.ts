import { IplayerData } from './i-player-data';
import { growthSpeed, SERVER_EMIT_INTERVAL } from './constants';
import SocketIO from 'socket.io';
import { PlayerSocket } from './player-socket';
import { MapState } from './map-state';

export class ServerSocket {
  private io: SocketIO.Server;
  private lengths: number[];
  private rotations: number[];
  private positions: [number, number][];
  private cuts: boolean[];

  private players: Record<string, PlayerSocket>;

  constructor(server: import('http').Server, { lengths, rotations, positions }: MapState) {
    this.io = SocketIO(server);

    this.positions = positions;
    this.lengths = lengths;
    this.rotations = rotations;
    this.cuts = positions.map(() => false);

    this.players = {};

    this.attachSocketServerHandlers();
    this.createSocketServerEmitters();
  }

  private attachSocketServerHandlers() {
    this.io.on('connect', (socket) => {
      this.players[socket.id] = new PlayerSocket(
        socket,
        {
          receiveCuts: this.recieveCuts.bind(this),
        },
        this.getMapState(),
      );
      socket.on('disconnect', () => {
        delete this.players[socket.id];
      });
    });
  }

  private recieveCuts(incomingCuts: boolean[]) {
    if (incomingCuts.length !== this.cuts.length) {
      return;
    }
    this.cuts = this.cuts.map((currentCut, cutIndex) => currentCut || incomingCuts[cutIndex]);
    this.lengths = this.lengths.map((length, lengthIndex) =>
      incomingCuts[lengthIndex] ? 0 : length,
    );
  }

  private getMapState(): MapState {
    return {
      positions: this.positions,
      rotations: this.rotations,
      lengths: this.lengths,
    };
  }

  private playerLocations() {
    return Object.values(this.players).reduce((record, player) => {
      const playerData = player.getPlayerData();
      return { ...record, [playerData.id]: playerData };
    }, {} as Record<string, IplayerData>);
  }

  private createSocketServerEmitters() {
    setInterval(() => {
      if (this.cuts.some(Boolean)) {
        this.io.emit('updateClientCuts', this.cuts);
        this.cuts = this.positions.map(() => false);
      }
    }, SERVER_EMIT_INTERVAL);

    // Grow
    setInterval(() => {
      this.lengths = this.lengths.map((length) => Math.min(length + growthSpeed, 1));
      this.io.emit('updateClientGrowth', growthSpeed);
    }, SERVER_EMIT_INTERVAL);

    // Locations
    setInterval(() => {
      this.io.emit('updateClientPlayerLocations', this.playerLocations());
    }, SERVER_EMIT_INTERVAL);
  }
}
