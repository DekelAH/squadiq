import 'dotenv/config'
import express from 'express'
import { createServer } from 'http'

import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'

import { connectDB } from './config/db'
import { env } from './config/env'

import { startSimulator } from './simulator'
import { attachSocket, io } from './socket'

import authRouter from './routes/auth'
import matchesRouter from './routes/matches'
import playersRouter from './routes/players'
import serversRouter from './routes/servers'
import { initAIService } from './services/AIService'


const app = express()
const server = createServer(app)

app.use(helmet())
app.use(cors({
    
    origin: env.CLIENT_ORIGIN,
    credentials: true,
}))
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
}))

app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' })
})

app.use('/api/auth', authRouter)
app.use('/api/matches', matchesRouter)
app.use('/api/players', playersRouter)
app.use('/api/servers', serversRouter)

attachSocket(server)
initAIService(io)

async function start() {
    await connectDB()
    
    if (env.DEMO_MODE) {
        startSimulator()
    }

    server.listen(env.PORT, () => {
        console.log(`Server running on port ${env.PORT}`)
    })
}
start()
