# Inventory — Orders & Products

SPA для учёта приходов (Orders) и продуктов (Products): список приходов с деталями, удаление и создание приходов, продукты с фильтром по типу, статистика, карта складов, авторизация, онлайн-счётчик вкладок и два языка интерфейса.

- **Демо:** <https://inventory-olive-two.vercel.app>
- **Видео:** <https://drive.google.com/file/d/1H42JUcoylA1qlUC7dROydgn0eQgqhICk/view?usp=sharing>
- **Тестовый пользователь:** `admin@inventory.com` / `password123`

> Демо работает на бесплатных тарифах: backend «засыпает» после 15 минут без запросов, поэтому первое открытие может занять до минуты.

## Стек

| Часть          | Технологии                                                                                                                                         |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Frontend       | Next.js 16 (App Router), React 19, TypeScript, Redux Toolkit + RTK Query, SCSS (BEM) + Bootstrap 5, next-intl, Recharts, Leaflet, socket.io-client |
| Backend        | Node.js 22, Express 5, TypeScript, Socket.io, mysql2, JWT (jsonwebtoken + bcryptjs)                                                                |
| База данных    | MySQL 8.4                                                                                                                                          |
| Тесты          | Vitest + React Testing Library                                                                                                                     |
| Инфраструктура | Docker, Docker Compose                                                                                                                             |
| Деплой         | Vercel (frontend), Render (backend), Aiven (MySQL)                                                                                                 |

## Возможности

- **Приходы:** список с количеством продуктов, датами и суммой в двух валютах; панель с продуктами выбранного прихода; создание и удаление (с подтверждением в модальном окне).
- **Продукты:** список с фильтром по типу.
- **Статистика:** графики по приходам и по типам продуктов.
- **Склады:** карта (Leaflet, OpenStreetMap).
- **Авторизация:** регистрация и вход по JWT; создавать и удалять приходы может только вошедший пользователь.
- **Онлайн-счётчик:** число открытых вкладок в шапке, обновляется в реальном времени через Socket.io.
- **Мультиязычность:** русский и английский (next-intl), выбор сохраняется в cookie.
- **Адаптивная вёрстка:** ноутбук, планшет, телефон.
- Анимации переходов между страницами, страница 404.

## Структура

```
frontend/            # Next.js приложение, Dockerfile
backend/             # Express + Socket.io + MySQL, Dockerfile
db/                  # схема БД и тестовые данные (применяются при первом старте MySQL)
docs/inventory.mwb   # схема БД для MySQL Workbench
docker-compose.yml   # MySQL + backend + frontend
```

## Запуск в Docker (всё одной командой)

Нужен только Docker.

```bash
cp .env.example .env
docker compose up -d --build
```

Поднимутся три контейнера:

| Сервис                    | Адрес                       |
| ------------------------- | --------------------------- |
| frontend                  | <http://localhost:3000>     |
| backend (API + Socket.io) | <http://localhost:4000/api> |
| MySQL                     | `localhost:3306`            |

Проверка: `docker compose ps` (mysql и backend — `healthy`), `curl http://localhost:4000/api/health` → `{"status":"ok"}`.

Остановить: `docker compose down`. Остановить и удалить данные БД: `docker compose down -v`.

## Запуск для разработки

Нужны Node.js 22+ и Docker (для MySQL).

```bash
# 1. База данных
cp .env.example .env
docker compose up -d mysql

# 2. Backend (порт 4000)
cd backend
cp .env.example .env
npm install
npm run dev

# 3. Frontend (порт 3000), в другом терминале
cd frontend
npm install
npm run dev
```

Откройте <http://localhost:3000>. Если backend уже запущен в Docker, сначала остановите его: `docker compose stop backend frontend`.

## Тесты и проверки

```bash
cd frontend
npm test              # Vitest + React Testing Library
npm run lint          # ESLint
npm run format:check  # Prettier

cd backend
npm run typecheck     # проверка типов
npm run ws:check      # ручная проверка онлайн-счётчика (сервер должен быть запущен)
```

## Переменные окружения

Примеры: `.env.example` (Docker Compose) и `backend/.env.example`.

| Переменная                                                | Где      | Назначение                                      |
| --------------------------------------------------------- | -------- | ----------------------------------------------- |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | backend  | подключение к MySQL                             |
| `DB_SSL_CA`                                               | backend  | CA-сертификат облачной MySQL; локально не нужен |
| `JWT_SECRET`                                              | backend  | секрет для подписи токенов                      |
| `CORS_ORIGINS`                                            | backend  | адреса фронтенда через запятую                  |
| `NEXT_PUBLIC_API_URL`                                     | frontend | адрес backend (подставляется при сборке)        |

## База данных

Структура повторяет `app.js` из ТЗ, плюс таблица пользователей:

- `orders` — приходы (`id`, `title`, `description`, `date`).
- `products` — продукты (`serial_number`, `is_new`, `photo`, `title`, `type`, `specification`, `guarantee_start`, `guarantee_end`, `price`, `order_id`, `date`). `price` — JSON-массив `[{"value", "symbol", "isDefault"}]`, как в `app.js`. При удалении прихода удаляются и его продукты.
- `users` — пользователи (`name`, `email`, `password_hash`).

Схема: `db/01-schema.sql`, тестовые данные: `db/02-seed.sql`, модель для Workbench: `docs/inventory.mwb`.

## API

| Метод  | URL                   | Описание                                                     |
| ------ | --------------------- | ------------------------------------------------------------ |
| GET    | `/api/health`         | Проверка сервера и подключения к БД                          |
| POST   | `/api/auth/register`  | Регистрация → `{ token, user }`                              |
| POST   | `/api/auth/login`     | Вход → `{ token, user }`                                     |
| GET    | `/api/auth/me`        | Текущий пользователь 🔒                                      |
| GET    | `/api/orders`         | Список приходов: количество продуктов, сумма в каждой валюте |
| GET    | `/api/orders/:id`     | Приход вместе с продуктами                                   |
| POST   | `/api/orders`         | Создать приход 🔒                                            |
| DELETE | `/api/orders/:id`     | Удалить приход вместе с продуктами 🔒                        |
| GET    | `/api/products`       | Все продукты; фильтр по типу: `?type=Monitors`               |
| GET    | `/api/products/types` | Список типов продуктов                                       |

🔒 — нужен заголовок `Authorization: Bearer <token>`.

**Socket.io:** событие `activeSessions` (число) рассылается всем клиентам при каждом подключении и отключении вкладки.

## Деплой

- **Frontend** — Vercel, папка `frontend`, переменная `NEXT_PUBLIC_API_URL`.
- **Backend** — Render (Docker из `backend/Dockerfile`), переменные из таблицы выше.
- **MySQL** — Aiven, подключение по SSL.
