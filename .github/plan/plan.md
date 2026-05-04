# SquadIQ — Development Plan

**What exists:** Docker/nginx infra, dependency installs, stub `index.ts` (server) and `main.tsx` (client), `.env.example`. Almost no application code.

**Goal:** A real-time analytics dashboard for the PC game Squad — live kill feeds, leaderboards, ticket countdowns, and GPT-4o round diagnostics.

---

## Phase 1 — Server Foundation

**1.1 Config & DB**
- `server/src/config/env.ts` — validate env with Zod (`DEMO_MODE`, `MONGO_URI`, `JWT_*`, `OPENAI_*`, `RCON_*`, `CORS_ORIGIN`)
- `server/src/config/db.ts` — Mongoose connection with retry
- Wire into `index.ts`: Express app, CORS, Helmet, Morgan, rate-limit, cookie-parser

**1.2 TypeScript tooling (missing configs)**
- `server/tsconfig.json`
- `client/tsconfig.json`
- `client/vite.config.ts`
- `client/tailwind.config.ts` + `client/postcss.config.ts` (needed for `surface-*` custom colors in `index.css`)

**1.3 Shared Types**
- `server/src/types/` — `Match`, `Player`, `KillEvent`, `ReviveEvent`, `CaptureEvent`, `Leaderboard`, `AIAnalysis`

---

## Phase 2 — Data Models (Mongoose)

| Model | Key fields |
|---|---|
| `User` | username, passwordHash, role, refreshToken |
| `Match` | serverId, map, layer, startedAt, endedAt, winner, tickets[team1, team2], aiAnalysis |
| `Player` | steamId, username, matchId, kills, deaths, revives, teamId |
| `Event` | matchId, type (kill/revive/capture), timestamp, payload |

---

## Phase 3 — Event Bus + Simulator (Demo Mode)

- `server/src/events/EventBus.ts` — typed in-memory pub/sub
- `server/src/events/EventPersister.ts` — write events to MongoDB on emit
- `server/src/simulator/index.ts`:
  - Pick random Squad map/layer from a list
  - Emit `match:start` → fire `kill`, `revive`, `capture` events on intervals → countdown tickets → emit `match:end` → trigger AI → loop

---

## Phase 4 — RCON Connector (Real Mode)

- `server/src/rcon/RconClient.ts` — TCP RCON protocol to Squad server
- `server/src/rcon/LogParser.ts` — parse Squad log output into typed events
- Gate behind `DEMO_MODE === false`

---

## Phase 5 — Socket.io

- `server/src/socket/index.ts` — attach Socket.io to HTTP server
- `server/src/socket/handlers.ts`:
  - `server:subscribe` → join room by serverId
  - Broadcast `event:kill`, `event:revive`, `event:capture`, `leaderboard:update`, `server:status`, `match:start`, `match:end`, `match:analysis_ready`

---

## Phase 6 — REST API + Auth

**Auth routes** (`/api/auth`)
- `POST /register`, `POST /login` → issue JWT access + refresh cookies
- `POST /refresh`, `POST /logout`
- `server/src/middleware/auth.ts` — verify access token middleware

**Match routes** (`/api/matches`)
- `GET /` — paginated match history
- `GET /:id` — match detail with events + AI analysis

**Player routes** (`/api/players`)
- `GET /:steamId` — player career stats

**Server status** (`/api/servers/:id/status`)
- Current map, tickets, player count

**Swagger** — JSDoc annotations + `swagger-jsdoc` + `swagger-ui-express` at `/api/docs`

---

## Phase 7 — AI Service

- `server/src/services/AIService.ts`
- Triggered on `match:end`
- Build prompt from match stats (kills, revives, captures, MVP, top medic, ticket history)
- Call `gpt-4o` → parse structured JSON: `{ summary, mvp, topMedic, turningPoint, team1Strengths, team2Weaknesses, tacticalTip }`
- Save to `Match.aiAnalysis`, emit `match:analysis_ready` via Socket.io

---

## Phase 8 — Frontend

**8.1 Foundation**
- `client/src/App.tsx` — React Router 6 routes
- `client/src/api/` — Axios instance with JWT interceptor + API functions
- `client/src/store/` — Zustand stores: `matchStore`, `serverStore`, `authStore`
- `client/src/hooks/useSocket.ts` — Socket.io connection lifecycle

**8.2 Pages**

| Page | Route | Content |
|---|---|---|
| Dashboard | `/` | Live kill feed, leaderboard, ticket bars, server status |
| Matches | `/matches` | Paginated match history table |
| Match Detail | `/matches/:id` | Timeline, player stats table, AI diagnostic card |
| Player | `/players/:steamId` | Career stats, K/D chart over time |
| Login / Register | `/auth` | JWT auth forms |

**8.3 Key Components**
- `KillFeed` — scrolling live event list
- `Leaderboard` — sortable table (kills/deaths/revives/KD)
- `TicketBar` — animated countdown for each team
- `ServerStatusHeader` — map, layer, player count
- `AIAnalysisCard` — formatted GPT-4o output, shown after `match:analysis_ready`
- `MatchTimeline` — Recharts area chart of ticket history

---

## Phase 9 — Polish & DevOps

- ESLint + Prettier configs for both packages
- Docker Compose health checks (server waits for mongo)
- nginx `gzip` + static asset cache headers
- Environment variable docs in README updated
- Loading/error states throughout UI

---

## Suggested Build Order

```
1  → Tooling configs (TS, Vite, Tailwind)
2  → Server config/db + Express skeleton
3  → Mongoose models + shared types
4  → EventBus + Simulator (get events flowing)
5  → Socket.io (stream events)
6  → Frontend skeleton + useSocket + Dashboard (live feed visible)
7  → REST API + Auth
8  → AI Service
9  → Remaining pages (Matches, Match Detail, Player)
10 → RCON real-mode connector
11 → Polish, Docker hardening
```
