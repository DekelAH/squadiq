import { Server } from "socket.io"
import eventBus from "../events/EventBus"
import { IEventPayloads } from "../events/EventBus"
import Event from "../models/Event"
import Match from "../models/Match"

type MatchStartPayload = IEventPayloads['match:start']

export function registerHandlers(io: Server) : void {

    let currentServerId = ''
    let currentMatchSnapshot: MatchStartPayload | null = null

    io.on('connection', (socket) => {

        socket.on('server:subscribe', async (serverId: string) => {
            socket.join(serverId)
            if (currentMatchSnapshot && currentMatchSnapshot.serverId === serverId) {

                const match = await Match.findById(currentMatchSnapshot._id)
                const events = await Event.find({ matchId: currentMatchSnapshot._id }).sort({ timestamp: 1 })

                socket.emit('match:snapshot', {
                    match: currentMatchSnapshot,
                    events,
                    tickets: match?.tickets ?? currentMatchSnapshot.tickets,
                })
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

    eventBus.on('tickets:update', (payload) => {

        io.to(currentServerId).emit('tickets:update', payload)
    })

    eventBus.on('match:end', (payload) => {
        currentMatchSnapshot = null
        io.to(currentServerId).emit('match:end', payload)
    })
}