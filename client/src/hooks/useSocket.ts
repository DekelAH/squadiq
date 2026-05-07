import { useEffect } from "react"
import { io } from 'socket.io-client'
import { useMatchStore } from "../store/matchStore"
import { useServerStore } from "../store/serverStore"


export function useSocket() {

    useEffect(() => {

        const socket = io({ withCredentials: true })

        socket.emit('server:subscribe', 'demo-server-1')

        socket.on('match:start', (payload) => {
            useMatchStore.getState().setMatch(payload)
            useServerStore.getState().setServerStatus({
                serverId: payload.serverId,
                status: 'online',
                map: payload.map,
                layer: payload.layer,
                tickets: payload.tickets,
                playerCount: 0
            })
        })
        socket.on('event:kill', (payload) => {
            useMatchStore.getState().addEvent({
                _id: crypto.randomUUID(),
                matchId: '',
                type: 'kill',
                timestamp: new Date(),
                payload: payload
            })
        })
        socket.on('event:revive', (payload) => {
            useMatchStore.getState().addEvent({
                _id: crypto.randomUUID(),
                matchId: '',
                type: 'revive',
                timestamp: new Date(),
                payload: payload
            })
        })
        socket.on('event:capture', (payload) => {
            useMatchStore.getState().addEvent({
                _id: crypto.randomUUID(),
                matchId: '',
                type: 'capture',
                timestamp: new Date(),
                payload: payload
            })
        })

        socket.on('match:end', (payload) => {
            useMatchStore.getState().setMatch(payload)
            useServerStore.getState().setServerStatus({
                serverId: payload.serverId,
                status: 'offline',
                map: payload.map,
                layer: payload.layer,
                tickets: payload.tickets,
                playerCount: 0
            })
        })

        return () => { socket.disconnect() }

    }, [])
}