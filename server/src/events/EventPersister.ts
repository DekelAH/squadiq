import eventBus from "./EventBus"
import Event from '../models/Event'

export function startPersisting(matchId: string) {

    eventBus.on('event:kill', async (payload) => {

        try {
            const killEvent = new Event({

                matchId: matchId,
                type: 'kill',
                timestamp: new Date(),
                payload: payload
            })
            await killEvent.save()
        } catch (error) { console.error('Failed to persist kill event:', error) }
    })

    eventBus.on('event:revive', async (payload) => {

        try {
            const reviveEvent = new Event({

                matchId: matchId,
                type: 'revive',
                timestamp: new Date(),
                payload: payload
            })
            await reviveEvent.save()
        } catch (error) { console.error('Failed to persist revive event:', error) }
    })

    eventBus.on('event:capture', async (payload) => {

        try {
            const captureEvent = new Event({

                matchId: matchId,
                type: 'capture',
                timestamp: new Date(),
                payload: payload
            })
            await captureEvent.save()
        } catch (error) { console.error('Failed to persist capture event:', error) }
    })
}