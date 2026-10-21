# Backend

This Express backend provides a MongoDB-backed `/api/tasks` CRUD API and serves the frontend production build from `../frontend/dist`.

## Practical 5 setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env`.
3. Start MongoDB locally, or replace `MONGO_URI` with a MongoDB Atlas connection string.
4. Run `npm run dev`.

The task schema validates `title`, supplies defaults for `description`, `completed`, `priority`, and `createdAt`, and returns validation errors as JSON.

Scripts:

- `npm run dev` — run `server.js` with `nodemon` for development (does not build frontend).
- `npm start` — builds the frontend (`npm run build` in `../frontend`) then starts the server.

Ports:

- Backend: `5000` by default (configurable via `PORT`).
