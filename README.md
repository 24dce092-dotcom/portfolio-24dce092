# Task Management Full-Stack Project — ITUE301 (AWD Frameworks)

Semester-long project built across Practicals 1–13. Starts as a React
portfolio site (P1–P3), grows a Node/Express/MongoDB backend (P4–P5),
merges into one full-stack app (P6+), then adds auth, performance,
caching, events, Docker, CI/CD, and AI integration (P7–P13).

**Roll No:** 24DCE092

## Structure

```
/frontend   → React app (Vite). Practicals 1, 2, 3, 8.
/backend    → Node/Express/MongoDB API. Practicals 4, 5, 9, 10.
/docs       → Per-practical notes, screenshots, before/after evidence.
```

One monorepo, two apps. `frontend/` and `backend/` run as independent
npm projects (own `package.json`, own `node_modules`) but live and
version together so Practical 6+ (full-stack integration, Docker
Compose, CI/CD) can reference both in one place.

## Practical → Milestone Map

| # | Practical | Folder(s) | Git Tag |
|---|-----------|-----------|---------|
| 1 | React components + props | `frontend/` | `p1-done` |
| 2 | Routing + useState | `frontend/` | `p2-done` |
| 3 | REST API consumption | `frontend/` | `p3-done` |
| 4 | Express REST API | `backend/` | `p4-done` |
| 5 | MongoDB + Mongoose | `backend/` | `p5-done` |
| 6 | Full-stack integration | both | `p6-done` |
| 7 | JWT auth + validation | `backend/` (+frontend) | `p7-done` |
| 8 | Lazy loading / perf | `frontend/` | `p8-done` |
| 9 | In-memory caching | `backend/` | `p9-done` |
| 10 | EventEmitter async | `backend/` | `p10-done` |
| 11 | Docker + Compose | root, both | `p11-done` |
| 12 | CI/CD (GitHub Actions) | `.github/workflows/` | `p12-done` |
| 13 | AI API integration | both | `p13-done` |

Each practical is committed as one or more meaningful commits, then
tagged (e.g. `git tag p1-done && git push origin p1-done`) so any past
state can be checked out for viva/evaluation without losing later work.

## Running locally

```bash
# frontend
cd frontend && npm install && npm run dev      # http://localhost:5173

# backend
cd backend && npm install && npm run dev       # http://localhost:5000
```

Both must run in separate terminals for full-stack practicals (P6+).
From Practical 11 onward, `docker-compose up --build` runs everything
(frontend, backend, MongoDB) with one command.

## Environment variables

Never commit `.env`. Each app folder has a `.env.example` listing the
required keys (`MONGO_URI`, `JWT_SECRET`, `OPENAI_API_KEY`, etc.) —
copy it to `.env` and fill in real values locally.

## Progress log

See [`docs/progress.md`](docs/progress.md) for a running log of what's
done, screenshots/evidence for practicals that require them (8, 9, 12),
and viva notes.
