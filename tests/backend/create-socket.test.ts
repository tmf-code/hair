import { growthSpeed } from './../../backend/src/constants';
import io from 'socket.io-client';
import http from 'http';
import { AddressInfo } from 'net';

import { createSocket } from '../../backend/src/create-socket';
import { SERVER_EMIT_INTERVAL } from '../../backend/src/constants';

describe('Create socket Tests', () => {
  let socket: SocketIOClient.Socket | undefined;

  const httpServer = http.createServer().listen();
  const httpServerAddr = httpServer.address() as AddressInfo;
  let grid: [number, number][] = [];
  let rotations: number[] = [];
  let lengths: number[] = [];

  let ioServer: SocketIO.Server;
  afterAll((done) => {
    httpServer.close();
    if (socket?.connected) {
      socket?.disconnect();
    }
    ioServer?.close();
    done();
  });

  beforeAll((done) => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    ioServer = createSocket(httpServer);
    const connectionOptions: SocketIOClient.ConnectOpts = {
      reconnectionDelay: 0,
      forceNew: true,
      transports: ['websocket'],
    };
    socket = io.connect(
      `http://[${httpServerAddr.address}]:${httpServerAddr.port}`,
      connectionOptions,
    );
    lengths = [];
    grid = [];
    rotations = [];

    const connected = new Promise((resolve) => {
      socket?.on('connect', () => {
        resolve();
      });
    });

    const gridRecieved = new Promise((resolve) => {
      socket?.once('updateClientGrid', (message: [number, number][]) => {
        grid = message;
        resolve();
      });
    });

    const rotationsReceived = new Promise((resolve) => {
      socket?.once('updateClientRotations', (message: number[]) => {
        rotations = message;
        resolve();
      });
    });
    const lenghtsReceived = new Promise((resolve) => {
      socket?.once('updateClientLengths', (message: number[]) => {
        lengths = message;
        resolve();
      });
    });

    const isConnectedSuccessfully = Promise.all([
      connected,
      gridRecieved,
      rotationsReceived,
      lenghtsReceived,
    ]);

    isConnectedSuccessfully.then(() => {
      done();
    });
  });

  test('Socket should be able to emit', (done) => {
    const testMessage = 'Test';
    ioServer.emit('echo', testMessage);
    socket?.once('echo', (message: string) => {
      expect(message).toBe(testMessage);
      done();
    });
    ioServer.on('connection', (mySocket: string) => {
      expect(mySocket).toBeDefined();
    });
  });

  test('Socket should emit grid', () => {
    expect(grid.length).toBeGreaterThan(0);
    expect(grid[0]).toHaveLength(2);
  });

  test('Socket should emit rotations', () => {
    expect(rotations.length).toBeGreaterThan(0);
  });

  test('Socket should emit lengths', () => {
    expect(lengths.length).toBeGreaterThan(0);
  });
  test('Socket should initialise two intervals', () => {
    expect(setInterval).toHaveBeenCalledTimes(2);
  });
  test('Socket should grow at interval', (done) => {
    const intervalsCount = 1.5;
    const totalWaitInterval = SERVER_EMIT_INTERVAL * intervalsCount;

    socket?.once('updateClientGrowth', (message: number) => {
      expect(message).toBe(growthSpeed);
      done();
    });

    jest.advanceTimersByTime(totalWaitInterval);
  });
  test('Socket should updateCuts at interval', (done) => {
    const intervalsCount = 1.5;
    const totalWaitInterval = SERVER_EMIT_INTERVAL * intervalsCount;
    const expected = lengths.map(() => true);

    socket?.emit('updateServerCuts', expected);

    socket?.once('updateClientCuts', (message: boolean[]) => {
      expect(message).toStrictEqual(expected);
      done();
    });

    jest.useRealTimers();

    setTimeout(() => {
      jest.useFakeTimers();
      jest.advanceTimersByTime(totalWaitInterval);
    }, 50 /* gives enough time to process message */);
  });
});
