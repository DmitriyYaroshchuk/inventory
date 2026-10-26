// Ручная проверка счётчика сессий без фронтенда:
//   npm run ws:check   (сервер должен быть запущен: npm run dev)
import { io } from 'socket.io-client';

const url = process.env.WS_URL ?? 'http://localhost:4000';
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const first = io(url);
  first.on('activeSessions', (count: number) =>
    console.log(`[клиент 1] активных сессий: ${count}`),
  );
  await wait(500);

  console.log('→ открываем вторую «вкладку»');
  const second = io(url);
  await wait(500);

  console.log('→ закрываем вторую «вкладку»');
  second.disconnect();
  await wait(500);

  first.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
