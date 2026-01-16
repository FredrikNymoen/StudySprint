# StudySprint

A webapp for planning and logging study sessions with pomodoro timer, goal tracking, and statistics.

## Features

- **Sprints** - Create study plans with deadlines and goals (e.g., "Economics 2: chapters 3-5 by Friday")
- **Timer** - Pomodoro (15/25/45/60 min) or free session
- **Goals** - Add and check off goals for each sprint
- **Statistics** - Weekly reports, streaks, and overall summary

## Tech Stack

| Frontend | Backend |
|----------|---------|
| React 19 | Node.js |
| TypeScript | Express |
| Tailwind CSS | SQLite |
| TanStack Query | better-sqlite3 |
| Zustand | |
| React Router | |

## Getting Started

```bash
# Backend
cd backend
npm install
npm run dev        # http://localhost:3000

# Frontend (new terminal)
cd frontend
npm install
npm run dev        # http://localhost:5173
```

## API Endpoints

| Resource | Endpoint |
|----------|----------|
| Sprints | `GET/POST /api/sprints`, `GET/PUT/DELETE /api/sprints/:id` |
| Sessions | `GET/POST /api/sessions`, `GET/PUT/DELETE /api/sessions/:id` |
| Goals | `GET/POST /api/goals`, `PUT/DELETE /api/goals/:id` |
| Tags | `GET/POST/DELETE /api/tags` |
| Stats | `GET /api/stats/weekly`, `/streaks`, `/summary` |

## Project Structure

```
├── backend/
│   └── src/
│       ├── index.js        # Express server
│       ├── db/             # SQLite database
│       └── routes/         # API routes
└── frontend/
    └── src/
        ├── pages/          # React pages
        ├── components/     # UI components
        ├── hooks/          # TanStack Query hooks
        ├── stores/         # Zustand state
        └── api/            # API client
```
