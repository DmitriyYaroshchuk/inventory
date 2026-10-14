import { createServer } from 'node:http';
import { createApp } from './app';
import { config } from './config';
import { pool } from './db';
import { setupSockets } from './sockets';

const httpServer = createServer(createApp());
const io = setupSockets(httpServer);

httpServer.listen(config.port, () => {
  console.log(`API: http://localhost:${config.port}/api  (Socket.io на том же порту)`);
});

const shutdown = async () => {
  console.log('Останавливаем сервер…');
  io.close();
  httpServer.close();
  await pool.end();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
