const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const main = require('./config/database');

const { Server } = require('socket.io');
const http = require('http');

const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const sensorRoutes = require('./routes/sensorRoutes');

const healthCheck = require('./controllers/healthCheck');

const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: '*', // Allow all origins (for now)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const db_test = main();

// Routes
app.use('/api', userRoutes);
app.use('/api', projectRoutes);
app.use('/api', sensorRoutes(io));
app.use('/health', healthCheck);

// WebSocket
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// ------------------ SERVER CONFIG ------------------ //
const PORT = 3000; // change if needed
const HOST = "0.0.0.0"; // listen on all network interfaces

server.listen(PORT, HOST, () => {
  console.log(`✅ Server is running at http://172.28.218.211:${PORT}`);
  console.log(`(Replace 172.28.218.211 with your IPv4 if it changes)`);
});
