// simple.js
const http = require('http');
const PORT = process.env.PORT || 3000;

const app = require('./app');
const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"]
  }
});

const notificationController = require('./api/controllers/notification');
notificationController.setIo(io);
const lessonsController = require('./api/controllers/lessons');
lessonsController.setIo(io);

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
