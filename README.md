# SquadIQ

Real-time analytics platform for the PC game **Squad**. Tracks live match events, player stats, and generates AI-powered round diagnostics using GPT-4o.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express, TypeScript |
| Real-time | Socket.io |
| Database | MongoDB + Mongoose |
| AI | OpenAI GPT-4o |
| Frontend | React 18, Vite, TypeScript |
| Styling | Tailwind CSS |
| State | Zustand + React Query |
| Charts | Recharts |
| Auth | JWT (access + refresh tokens) |
| DevOps | Docker Compose |

---

## Project Structure

```
squadiq/
├── server/                  # Node.js + Express backend
│   ├── src/
│   │   ├── config/          # env validation, DB connection
│   │   ├── types/           # shared TypeScript types
│   │   ├── models/          # Mongoose schemas
│   │   ├── events/          # EventBus + EventPersister
│   │   ├── rcon/            # Squad RCON connector + log parser
│   │   ├── simulator/       # Demo mode event generator
│   │   ├── socket/          # Socket.io setup + handlers
│   │   ├── middleware/       # auth, validation, errors
│   │   ├── routes/          # REST API routes
│   │   └── services/        # business logic (stats, AI)
│   └── docs/                # Swagger/OpenAPI
│
├── client/                  # React frontend
│   └── src/
│       ├── api/             # Axios instances + API functions
│       ├── hooks/           # useSocket, useKillFeed, etc.
│       ├── store/           # Zustand stores
│       ├── components/      # Reusable UI components
│       └── pages/           # Dashboard, Matches, Players
│
└── docker-compose.yml
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB (local or Atlas)
- OpenAI API key

### 1. Install dependencies

```bash
# Server
cd server && npm install

# Client
cd client && npm install
```

### 2. Configure environment

```bash
cp server/.env.example server/.env
# Fill in your OPENAI_API_KEY and other values
```

### 3. Run in development

```bash
# Terminal 1 — start MongoDB (or use Atlas)
# Terminal 2 — start server
cd server && npm run dev

# Terminal 3 — start client
cd client && npm run dev
```

Open http://localhost:3000

### 4. Run with Docker (one command)

```bash
docker-compose up --build
```

---

## Demo Mode

With `DEMO_MODE=true` (default), the server runs a built-in simulator that generates realistic Squad game events — no real server needed.

The simulator:
- Starts a match on a random Squad map/layer
- Fires kill, revive, flag capture events every few seconds
- Counts down tickets for both teams
- Ends the match when tickets hit 0
- Triggers GPT-4o to generate a round diagnostic automatically
- Loops to the next match after a short cooldown

To connect a real Squad server: set `DEMO_MODE=false` and fill in `RCON_HOST`, `RCON_PORT`, `RCON_PASSWORD`.

---

## API Documentation

Swagger UI available at: http://localhost:5000/api/docs

---

## WebSocket Events

| Event | Direction | Description |
|---|---|---|
| `server:subscribe` | Client → Server | Join a server room |
| `event:kill` | Server → Client | Kill event with killer/victim/weapon |
| `event:revive` | Server → Client | Revive event |
| `event:capture` | Server → Client | Flag captured |
| `leaderboard:update` | Server → Client | Updated leaderboard snapshot |
| `server:status` | Server → Client | Map, tickets, player count |
| `match:start` | Server → Client | New match began |
| `match:end` | Server → Client | Match ended with winner |
| `match:analysis_ready` | Server → Client | AI diagnostic is ready |

---

## AI Round Diagnostic

After each match ends, GPT-4o automatically generates a structured diagnostic including:
- Round summary
- MVP and top medic
- Turning point (key flag capture)
- Team strengths and weaknesses
- Tactical tip for the losing team

The analysis is saved to the match document in MongoDB and displayed on the Match Detail page.
