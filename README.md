# Inventory — Orders & Products

SPA-приложение для учёта приходов (Orders) и продуктов (Products).

> README дополняется по мере разработки: стек, функции, установка, запуск, деплой.

## Структура

```
db/                  # схема БД и тестовые данные (применяются при первом старте MySQL)
backend/             # Express + Socket.io + MySQL (TypeScript)
docker-compose.yml   # MySQL
```

## Запуск (разработка)

Нужны Node.js 22+ и Docker.

### 1. База данных

```bash
cp .env.example .env
docker compose up -d
```

Пересоздать базу с нуля (удалит данные): `docker compose down -v && docker compose up -d`

### 2. Бэкенд

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

API: <http://localhost:4000/api>. Socket.io работает на том же порту.

Проверка: `curl http://localhost:4000/api/health` → `{"status":"ok"}`

## API

| Метод | URL | Описание |
|---|---|---|
| GET | `/api/health` | Проверка сервера и подключения к БД |
| GET | `/api/orders` | Список приходов: количество продуктов, сумма в каждой валюте |
| GET | `/api/orders/:id` | Приход вместе с продуктами |
| DELETE | `/api/orders/:id` | Удалить приход вместе с продуктами (204 / 404) |
| GET | `/api/products` | Все продукты; фильтр по типу: `?type=Monitors` |
| GET | `/api/products/types` | Список типов продуктов (для селекта) |

### Socket.io

Событие `activeSessions` (число) рассылается всем клиентам при каждом подключении и отключении. Каждая открытая вкладка приложения держит одно соединение. Проверить без фронтенда: `npm run ws:check` (в папке `backend`, при запущенном сервере).

## Скрипты бэкенда

| Команда | Что делает |
|---|---|
| `npm run dev` | Запуск с автоперезагрузкой |
| `npm run build` | Сборка TypeScript в `dist/` |
| `npm start` | Запуск собранной версии |
| `npm run typecheck` | Проверка типов |
| `npm run ws:check` | Ручная проверка счётчика сессий |
