import { Server } from "socket.io"
import eventBus from "../events/EventBus"



export function registerHandlers(io: Server) : void {

    let currentServerId = ''
    io.on('connection', (socket) => {

        socket.on('server:subscribe', (serverId: string) => {

            socket.join(serverId)
        })
    })

    eventBus.on('match:start', (payload) => {
        currentServerId = payload.serverId
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

        io.to(currentServerId).emit('match:end', payload)
    })
}