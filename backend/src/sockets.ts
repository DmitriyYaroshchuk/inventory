import type { Server as HttpServer } from 'node:http';
import { Server } from 'socket.io';
import { config } from './config';

/**
 * Счётчик активных сессий: каждая открытая вкладка приложения держит одно
 * Socket.io-соединение. При подключении и отключении рассылаем всем текущее число.
 */
export function setupSockets(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: { origin: config.corsOrigins },
  });

  const broadcastActiveSessions = () => {
    io.emit('activeSessions', io.of('/').sockets.size);
  };

  io.on('connection', (socket) => {
    broadcastActiveSessions();
    socket.on('disconnect', broadcastActiveSessions);
  });

  return io;
}
