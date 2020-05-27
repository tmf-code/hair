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
    this.startEmitting();
  }

  private attachSocketServerHandlers() {
    this.io.on('connect', (socket) => {
      this.addPlayer(socket);
    });
  }

  private addPlayer(socket: SocketIO.Socket) {
    this.players[socket.id] = new PlayerSocket(
      socket,
      this.recieveCuts.bind(this),
      this.getMapState(),
    );

    socket.on('disconnect', () => {
      delete this.players[socket.id];
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

  private startEmitting() {
    const emit = () => {
      this.emitCuts();
      this.emitGrowth();
      this.emitPlayerLocations();

      const thisWasDestroyed = this === undefined;
      if (!thisWasDestroyed) {
        setTimeout(emit, SERVER_EMIT_INTERVAL);
      }
    };

    emit();
  }

  private emitCuts() {
    if (this.cuts.some(Boolean)) {
      this.io.emit('updateClientCuts', this.cuts);
      this.cuts = this.positions.map(() => false);
    }
  }

  private emitGrowth() {
    this.lengths = this.lengths.map((length) => Math.min(length + growthSpeed, 1));
    this.io.emit('updateClientGrowth', growthSpeed);
  }

  private emitPlayerLocations() {
    this.io.emit('updateClientPlayerLocations', this.playerLocations());
  }

  private playerLocations() {
    return Object.values(this.players).reduce((record, player) => {
      const playerData = player.getPlayerData();
      return { ...record, [playerData.id]: playerData };
    }, {} as Record<string, IplayerData>);
  }
}
