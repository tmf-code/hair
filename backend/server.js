const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

server.listen(3001);

const clients = new Map();

io.on('connection', (socket) => {
  socket.on('connect', () => {});
  socket.on('setSocketId', (id) => {
    clients.set(id, [0, 0]);
    return console.log('User connected with ID ', id);
  });
  socket.on('mouse', ({ id, mousePosition }) => {
    clients.set(id, mousePosition);
    // return console.log('M', id, mousePosition);
    socket.emit('mice', Object.fromEntries(clients));
  });

  socket.emit('mice', clients);
  socket.on('disconnect', () => console.log('Client disconnected'));
});
