import { Server } from "socket.io"
import eventBus from "../events/EventBus"
import { IEventPayloads } from "../events/EventBus"

type MatchStartPayload = IEventPayloads['match:start']

export function registerHandlers(io: Server) : void {

    let currentServerId = ''
    let currentMatchSnapshot: MatchStartPayload | null = null

    io.on('connection', (socket) => {

        socket.on('server:subscribe', (serverId: string) => {
            socket.join(serverId)
            if (currentMatchSnapshot && currentMatchSnapshot.serverId === serverId) {
                socket.emit('match:start', currentMatchSnapshot)
            }
        })
    })

    eventBus.on('match:start', (payload) => {
        currentServerId = payload.serverId
        currentMatchSnapshot = payload
        io.to(currentServerId).emit('match:start', payload)
    })

    eventBus.on('event:kill', (payload) => {
        
        io.to(currentServerId).emit('event:kill', payload)
    })

    eventBus.on('event:revive', (payload) => {
        
        io.to(currentServerId).emit('event:revive', payload)
    })

    eventBus.on('event:capture', (payload) => {
        
        io.to(currentServerId).emit('event:capture', payload)
    })

    eventBus.on('match:end', (payload) => {
        currentMatchSnapshot = null
        io.to(currentServerId).emit('match:end', payload)
    })
}