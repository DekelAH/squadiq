import eventBus from "./EventBus"
import Event from '../models/Event'
import { CapturePayload, KillPayload, RevivePayload } from "../types"

let killHandler: ((p: KillPayload) => void) | null = null
let reviveHandler: ((p: RevivePayload) => void) | null = null
let captureHandler: ((p: CapturePayload) => void) | null = null

export function startPersisting(matchId: string) {

    if (killHandler) eventBus.off('event:kill', killHandler)
    if (reviveHandler) eventBus.off('event:revive', reviveHandler)
    if (captureHandler) eventBus.off('event:capture', captureHandler)

    killHandler = async (payload) => {
        try {
            await new Event({ matchId, type: 'kill', timestamp: new Date(), payload }).save()
        } catch (error) { console.error('Failed to persist kill event:', error) }
    }

    reviveHandler = async (payload) => {
        try {
            await new Event({ matchId, type: 'revive', timestamp: new Date(), payload }).save()
        } catch (error) { console.error('Failed to persist revive event:', error) }
    }

    captureHandler = async (payload) => {
        try {
            await new Event({ matchId, type: 'capture', timestamp: new Date(), payload }).save()
        } catch (error) { console.error('Failed to persist capture event:', error) }
    }

    eventBus.on('event:kill', killHandler)
    eventBus.on('event:revive', reviveHandler)
    eventBus.on('event:capture', captureHandler)
}
