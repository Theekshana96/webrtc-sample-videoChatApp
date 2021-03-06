const express = require('express');
const socket = require('socket.io');

const app = express();

const server = app.listen(5000, () => {
  console.log('http://localhost:5000/');
});

app.use(express.static('public'));

const io = socket(server);

io.on('connection', (socket) => {
  console.log(`User is connected: ${socket.id}`);

  socket.on('join', (roomName) => {
    const rooms = io.sockets.adapter.rooms;
    const room = rooms.get(roomName);

    if (!room) {
      socket.join(roomName);
      socket.emit('created');
    } else if (room.size === 1) {
      socket.join(roomName);
      socket.emit('joined');
    } else {
      socket.emit('full');
    }
  });

  socket.on('ready', (roomName) => {
    socket.broadcast.to(roomName).emit('ready');
  });

  socket.on('candidate', (candidate, roomName) => {
    socket.broadcast.to(roomName).emit('candidate', candidate);
  });

  socket.on('offer', (offer, roomName) => {
    socket.broadcast.to(roomName).emit('offer', offer);
  });

  socket.on('answer', (answer, roomName) => {
    socket.broadcast.to(roomName).emit('answer', answer);
  });
});
