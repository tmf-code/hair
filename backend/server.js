const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

server.listen(3001);

io.on('connection', (socket) => {
  socket.on('mouse', (data) => console.log('Mouse data received', data));
  socket.on('disconnect', () => console.log('Client disconnected'));
});
