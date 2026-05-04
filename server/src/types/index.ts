import { Types } from 'mongoose'

// ─── Enums ────────────────────────────────────────────────────────────────────

export type TeamId = 1 | 2

export type EventType = 'kill' | 'revive' | 'capture'

export type MatchStatus = 'in_progress' | 'ended'

// ─── AI Analysis ──────────────────────────────────────────────────────────────

export interface AIAnalysis {

    summary: string
    mvp: string
    topMedic: string
    turningPoint: string
    team1Strengths: string
    team2Weaknesses: string
    tacticalTip: string
}

// ─── User ────────────────────────────────────────────────────────────────────

export interface IUser {

    _id: Types.ObjectId
    username: string
    passwordHash: string
    role: 'admin' | 'user'
    refreshToken?: string
}

// ─── Match ────────────────────────────────────────────────────────────────────

export interface IMatch {

    _id: Types.ObjectId
    serverId: string
    map: string
    layer: string
    status: MatchStatus
    startedAt: Date
    endedAt?: Date
    winner?: TeamId
    tickets: { team1: number; team2: number }
    aiAnalysis?: AIAnalysis
}

// ─── Player ───────────────────────────────────────────────────────────────────

export interface IPlayer {

    _id: Types.ObjectId
    steamId: string
    username: string
    matchId: Types.ObjectId
    teamId: TeamId
    kills: number
    deaths: number
    revives: number
}

// ─── Events ───────────────────────────────────────────────────────────────────

export interface KillPayload {

    killerId: string
    killerName: string
    victimId: string
    victimName: string
    weapon: string
    teamId: TeamId
}

export interface RevivePayload {

    medicId: string
    medicName: string
    targetId: string
    targetName: string
    teamId: TeamId
}

export interface CapturePayload {

    flagName: string
    teamId: TeamId
}

export interface IEvent {

    _id: Types.ObjectId
    matchId: Types.ObjectId
    type: EventType
    timestamp: Date
    payload: KillPayload | RevivePayload | CapturePayload
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────

export interface LeaderboardEntry {

    steamId: string
    username: string
    teamId: TeamId
    kills: number
    deaths: number
    revives: number
    kd: number
}

export type Leaderboard = LeaderboardEntry[]