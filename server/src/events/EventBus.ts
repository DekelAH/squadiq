import { EventEmitter } from 'events'
import { AIAnalysis, CapturePayload, KillPayload, MatchStatus, RevivePayload, TeamId } from '../types'

interface IEventPayloads {

    'match:start': {

        _id: string,
        serverId: string,
        map: string,
        layer: string,
        status: MatchStatus,
        startedAt: Date,
        tickets: { team1: number; team2: number }
    },
    'match:end': {

        _id: string,
        serverId: string,
        map: string,
        layer: string,
        status: MatchStatus,
        endedAt: Date,
        winner?: TeamId,
        tickets: { team1: number; team2: number },
        aiAnalysis?: AIAnalysis
    },
    'event:kill': KillPayload,
    'event:revive': RevivePayload,
    'event:capture': CapturePayload
}

class EventBus extends EventEmitter {

    public emit<K extends keyof IEventPayloads>(event: K, payload: IEventPayloads[K]) {

        return super.emit(event, payload)
    }

    public on<K extends keyof IEventPayloads>(event: K, listener: (payload: IEventPayloads[K]) => void): this {

        return super.on(event, listener)
    }
}

const eventBus = new EventBus()
export default eventBus