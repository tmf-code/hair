import SocketIO from 'socket.io';

export type PlayerSocketCallbacks = {
  receiveCuts: (cuts: boolean[]) => void;
};

export class PlayerSocket {
  private readonly id: string;
  private position: [number, number];
  private rotation: number;
  private readonly socket: SocketIO.Socket;
  private readonly playerSocketCallbacks: PlayerSocketCallbacks;

  constructor(
    socket: SocketIO.Socket,
    callbacks: PlayerSocketCallbacks,
    currentMapState: { grid: [number, number][]; rotations: number[]; lengths: number[] },
  ) {
    this.id = socket.id;
    this.socket = socket;
    this.playerSocketCallbacks = callbacks;
    this.position = [0, 0];
    this.rotation = 0;

    this.addHandlers();
    this.emitOnce(currentMapState);
  }

  private addHandlers() {
    const socketEventHandlers = {
      updateServerCuts: this.playerSocketCallbacks.receiveCuts.bind(this),

      updatePlayerLocation: ({
        rotation,
        position,
      }: {
        rotation: number;
        position: [number, number];
      }) => {
        this.rotation = rotation;
        this.position = position;
      },
    };

    Object.entries(socketEventHandlers).forEach(([name, handler]) => {
      this.socket.on(name, handler);
    });
  }

  private emitOnce({
    grid,
    rotations,
    lengths,
  }: {
    grid: [number, number][];
    rotations: number[];
    lengths: number[];
  }) {
    this.socket.emit('updateClientGrid', grid);
    this.socket.emit('updateClientRotations', rotations);
    this.socket.emit('updateClientLengths', lengths);
  }

  getId = () => this.id;

  setPosition = (position: [number, number]) => (this.position = position);
  getPosition = () => this.position;

  setRotation = (rotation: number) => (this.rotation = rotation);
  getRotation = () => this.rotation;
}
