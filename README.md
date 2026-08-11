# AURA Travel

Премиальный travel-сайт на **Next.js 16 + Payload CMS 3 + MongoDB**.

## Стек

- Next.js 16 (App Router), React 19, TypeScript
- Payload CMS 3 (`@payloadcms/next`, `@payloadcms/db-mongodb`)
- Tailwind CSS v4, Framer Motion, Lucide, React Hook Form, Zod, Sonner

## Быстрый старт

1. MongoDB (уже можно через Docker):

```bash
docker start travel-mongo
# или
docker run -d --name travel-mongo -p 27017:27017 mongo:7
```

2. Переменные окружения (`.env`):

```
DATABASE_URL=mongodb://127.0.0.1/travel
PAYLOAD_SECRET=your-secret
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

3. Установка и запуск:

```bash
npm install
npm run dev
```

4. Сид демо-контента:

```bash
npm run seed
```

Админка: http://localhost:3000/admin  
Логин после seed: `admin@aura.travel` / `aura-admin-2026`

## Структура

- `src/collections` — Tours, Destinations, Testimonials, Team, FAQs, Applications, Media
- `src/globals` — Site Settings, Header, Footer, Homepage (blocks)
- `src/components/blocks` — блоки главной
- `src/app/(frontend)` — публичный сайт
- `src/app/(payload)` — Payload Admin + API

## CMS

Контент-менеджер управляет сайтом через `/admin`:

- туры и направления
- отзывы, FAQ, команда
- заявки (`applications`)
- блоки главной страницы (порядок и содержимое)
