import http from 'node:http'
import { Server } from "socket.io"
import { env } from "../config/env"
import { registerHandlers } from './handlers'


export let io: Server

export function attachSocket(httpServer: http.Server): void {

    io = new Server(httpServer, { cors: { origin: env.CLIENT_ORIGIN, credentials: true } })
    registerHandlers(io)
}