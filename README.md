# SquadIQ

Real-time analytics platform for the PC game **Squad**. Tracks live match events, player stats, and generates AI-powered round diagnostics using Claude.

**Live demo:** https://squadiq-client.onrender.com

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express, TypeScript |
| Real-time | Socket.IO |
| Database | MongoDB + Mongoose |
| AI | Anthropic Claude API |
| Frontend | React 18, Vite, TypeScript |
| Styling | Tailwind CSS |
| State | Zustand + TanStack Query |
| Charts | Recharts |
| Auth | JWT (access + refresh tokens, httpOnly cookies) |
| Deployment | Render (server + static site) + MongoDB Atlas |
| DevOps | Docker Compose (local) |

---

## Project Structure

```
squadiq/
├── server/                  # Node.js + Express backend
│   ├── src/
│   │   ├── config/          # env validation, DB connection
│   │   ├── models/          # Mongoose schemas
│   │   ├── simulator/       # Demo mode event generator
│   │   ├── socket/          # Socket.IO setup + handlers
│   │   ├── middleware/       # auth, validation
│   │   ├── routes/          # REST API routes
│   │   └── services/        # AI service, stats
│
├── client/                  # React frontend
│   └── src/
│       ├── api/             # Axios instance + API calls
│       ├── hooks/           # useSocket, etc.
│       ├── store/           # Zustand stores
│       ├── components/      # UI components
│       └── pages/           # Dashboard, Matches, Players
│
├── docker-compose.yml
└── render.yaml              # Render deployment blueprint
```

---

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB running locally (or Docker)
- Anthropic API key

### 1. Install dependencies

```bash
cd server && npm install
cd client && npm install
```

### 2. Configure environment

```bash
cp server/.env.example server/.env
# Fill in ANTHROPIC_API_KEY and other values
```

### 3. Run in development

```bash
# Terminal 1 — server
cd server && npm run dev

# Terminal 2 — client
cd client && npm run dev
```

Open http://localhost:3000

### 4. Run with Docker

```bash
docker-compose up --build
```

---

## Demo Mode

With `DEMO_MODE=true` (default), the server runs a built-in simulator — no real Squad server needed.

The simulator:
- Starts a match on a random Squad map/layer
- Fires kill, revive, and flag capture events every few seconds
- Counts down tickets for both teams
- Ends the match when tickets hit 0
- Triggers Claude to generate a round diagnostic automatically
- Loops to the next match after a short cooldown

To connect a real Squad server: set `DEMO_MODE=false` and fill in `RCON_HOST`, `RCON_PORT`, `RCON_PASSWORD`.

---

## Deployment (Render)

The repo includes a `render.yaml` Blueprint that defines both services.

**Steps:**
1. Create a [MongoDB Atlas](https://www.mongodb.com/atlas) cluster and get the connection string
2. Render Dashboard → **New** → **Blueprint** → connect this repo
3. Set the following env vars in the Render dashboard:

**`squadiq-server`:**
| Var | Value |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `ANTHROPIC_API_KEY` | Your Anthropic key |
| `CLIENT_ORIGIN` | `https://squadiq-client.onrender.com` |
| `NODE_ENV` | `production` |
| `JWT_SECRET` | Any strong random string |
| `JWT_REFRESH_SECRET` | Any strong random string |

**`squadiq-client`:**
| Var | Value |
|---|---|
| `VITE_API_URL` | `https://squadiq-server.onrender.com` |

---

## WebSocket Events

| Event | Direction | Description |
|---|---|---|
| `server:subscribe` | Client → Server | Join a server room |
| `event:kill` | Server → Client | Kill event with killer/victim/weapon |
| `event:revive` | Server → Client | Revive event |
| `event:capture` | Server → Client | Flag captured |
| `tickets:update` | Server → Client | Live ticket counts |
| `match:start` | Server → Client | New match began |
| `match:end` | Server → Client | Match ended with winner |
| `match:snapshot` | Server → Client | Full state sync on reconnect |
| `match:analysis_ready` | Server → Client | AI diagnostic is ready |

---

## AI Round Diagnostic

After each match ends, Claude automatically generates a structured diagnostic including:
- Round summary
- MVP and top medic
- Turning point (key flag capture)
- Team strengths and weaknesses
- Tactical tip for the losing team

The analysis is saved to the match document in MongoDB and displayed on the Match Detail page.
