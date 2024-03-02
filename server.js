import './env.js'
import express from 'express';
import require from './utils/require.js';
import aiRoutes from './routes/aiTranslationRoutes.js'
import cors from 'cors';
const bodyParser = require('body-parser');
import { Server } from 'socket.io';
import { createServer } from 'http'

const app = express();
const port = process.env.NODE_PORT;

app.use(cors({
  origin: '*'
}));

app.use(cors())

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }))


serverSocket.on('connection', (socket) => {
  console.log('New user connected ' + socket.id);

  socket.on('sendMessage', (message) => {
    serverSocket.emit('message', message); // Broadcast the message to all connected clients
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.use('/api', aiRoutes);

app.get("/", (req, res) => {
  res.send("API is running...")
})

app.get('/healthcheck', (req, res) => {
  res.status(200).json('The API is running 🤞');
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});