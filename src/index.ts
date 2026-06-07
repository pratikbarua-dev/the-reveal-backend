import express from 'express';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import { registerSocketHandlers } from './socket-handlers';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const frontendUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.trim() : '*';

app.use(cors({
  origin: frontendUrl,
  methods: ['GET', 'POST'],
}));

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

const httpServer = createServer(app);

const io = new SocketServer(httpServer, {
  cors: {
    origin: frontendUrl,
    methods: ['GET', 'POST'],
  },
  pingInterval: 10000,
  pingTimeout: 5000,
});

registerSocketHandlers(io);

httpServer.listen(port, () => {
  console.log(`🚀 Dedicated Backend Server running on port ${port}`);
});
