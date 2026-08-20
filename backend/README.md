# Backend

This is a minimal Express backend for the project. It provides a simple in-memory `/api/tasks` CRUD API and serves the frontend production build from `../frontend/dist`.

Scripts:

- `npm run dev` — run `server.js` with `nodemon` for development (does not build frontend).
- `npm start` — builds the frontend (`npm run build` in `../frontend`) then starts the server.

Ports:

- Backend: `5000` by default (configurable via `PORT`).
