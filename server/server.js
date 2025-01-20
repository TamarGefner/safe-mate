const express = require('express');
const http = require('http');
const { Server } = require('socket.io'); // Use destructuring for newer versions
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://safe-mate.netlify.app/', // Replace with the correct origin of your frontend
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
});

let users = [];

io.on('connection', (socket) => {
  console.log('User connected: ' + socket.id);

  // שמירת מיקום של משתמש
  socket.on('register-user', (location) => {
    users.push({ id: socket.id, location });
    console.log(`User ${socket.id} registered at location:`, location);
  });

  // שליחת התרעה למי שנמצא בטווח של 1 מטר
  socket.on('send-alert', (alertData) => {
    console.log('Alert received:', alertData);

    users.forEach((user) => {
      const distance = Math.sqrt(
        Math.pow(user.location.x - alertData.location.x, 2) +
        Math.pow(user.location.y - alertData.location.y, 2)
      );
      if (distance <= 0.0001) { // 0.0001 זה בערך 1 מטר על פי קואורדינטות
        io.to(user.id).emit('alert-received', alertData);
      }
    });
  });

  socket.on('disconnect', () => {
    users = users.filter((user) => user.id !== socket.id);
    console.log('User disconnected: ' + socket.id);
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
