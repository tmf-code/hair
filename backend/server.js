const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

server.listen(3000);

io.on('connection', (socket) => {
  socket.on('mouse', () => console.log('Mouse data received'));
  socket.on('disconnect', () => console.log('Client disconnected'));
});
