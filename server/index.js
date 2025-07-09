const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

let broadcaster;

// Basic route
app.get('/', (req, res) => {
  res.send('Live Broadcast Server is running!');
});

// Socket.io logic (chat & signaling)
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('broadcaster', () => {
    broadcaster = socket.id;
    socket.broadcast.emit('broadcaster');
  });

  socket.on('watcher', () => {
    if (broadcaster) {
      io.to(broadcaster).emit('watcher', socket.id);
      // Tuma notification kwa watcher kwamba broadcaster yupo
      io.to(socket.id).emit('broadcaster');
    }
  });

  socket.on('offer', (id, description) => {
    io.to(id).emit('offer', socket.id, description);
  });

  socket.on('answer', (id, description) => {
    io.to(id).emit('answer', socket.id, description);
  });

  socket.on('candidate', (id, candidate) => {
    io.to(id).emit('candidate', socket.id, candidate);
  });

  socket.on('chat-message', (data) => {
    io.emit('chat-message', data);
  });

  socket.on('disconnect', () => {
    io.emit('disconnectPeer', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
