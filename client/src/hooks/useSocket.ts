import { useEffect } from "react"
import { io } from 'socket.io-client'
import { useMatchStore } from "../store/matchStore"
import { useServerStore } from "../store/serverStore"
import { IEvent, IMatch } from "../types"


export function useSocket() {

    useEffect(() => {

        const socket = io(import.meta.env.VITE_API_URL ?? '', { withCredentials: true })

        socket.emit('server:subscribe', 'demo-server-1')

        socket.on('match:start', (payload) => {

            const prevMatch = useMatchStore.getState().currentMatch
            if (!prevMatch || prevMatch._id !== payload._id) {
                useMatchStore.getState().clearEvents()
            }
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

        socket.on('match:snapshot', (payload: { match: IMatch; events: IEvent[]; tickets: { team1: number; team2: number } }) => {
            
            useMatchStore.getState().setMatch(payload.match)
            useMatchStore.getState().setEvents(payload.events.slice().reverse())
            useServerStore.getState().setServerStatus({
                serverId: payload.match.serverId,
                status: 'online',
                map: payload.match.map,
                layer: payload.match.layer,
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

        socket.on('tickets:update', (payload: { team1: number; team2: number }) => {
            const s = useServerStore.getState()
            s.setServerStatus({
                serverId: s.serverId,
                status: s.status,
                map: s.map,
                layer: s.layer,
                playerCount: s.playerCount,
                tickets: payload,
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