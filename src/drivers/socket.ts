import io from 'socket.io-client';

const socket = io('http://localhost:3001');
socket.on('connect', () => {});
socket.on('event', () => {});
socket.on('disconnect', () => {});

export { socket };
