import { Schema, model } from 'mongoose'
import { IMatch } from '../types'

const matchSchema = new Schema<IMatch>({

    serverId: {
        type: String,
        required: true,
    },
    map: {
        type: String,
        required: true
    },
    layer: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['in_progress', 'ended'],
        default: 'in_progress'
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
    endedAt: {
        type: Date,
        required: false
    },
    winner: {
        type: Number,
        enum: [1, 2],
        required: false
    },
    tickets: {
        team1: { type: Number, required: true },
        team2: { type: Number, required: true }
    },
    aiAnalysis: {
        summary: { type: String },
        mvp: { type: String },
        topMedic: { type: String },
        turningPoint: { type: String },
        team1Strengths: { type: String },
        team2Weaknesses: { type: String },
        tacticalTip: { type: String }
    }

}, { timestamps: true })

const Match = model<IMatch>('Match', matchSchema)

export default Match