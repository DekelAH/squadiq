import { Schema, model } from 'mongoose'
import { IEvent } from '../types'

const eventSchema = new Schema<IEvent>({

    matchId: {

        type: Schema.Types.ObjectId,
        ref: 'Match',
        required: true
    },
    type: {

        type: String,
        enum: ['kill', 'revive', 'capture'],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    payload: {

        type: Schema.Types.Mixed,
        required: true
    }

}, { timestamps: true })

const Event = model<IEvent>('Event', eventSchema)
export default Event