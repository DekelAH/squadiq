import { Schema, model } from 'mongoose'
import { IPlayer } from '../types'

const playerSchema = new Schema<IPlayer>({

    steamId: {

        type: String,
        required: true
    },
    username: {

        type: String,
        required: true
    },
    matchId: {

        type: Schema.Types.ObjectId,
        ref: 'Match',
        required: true
    },
    teamId: {

        type: Number,
        enum: [1, 2]
    },
    kills: {

        type: Number,
        default: 0
    },
    deaths: {

        type: Number,
        default: 0
    },
    revives: {

        type: Number,
        default: 0
    }
}, { timestamps: true })

const Player = model<IPlayer>('Player', playerSchema)
export default Player