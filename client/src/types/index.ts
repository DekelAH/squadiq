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

    _id: string
    username: string
    role: 'admin' | 'user'
}

// ─── Match ────────────────────────────────────────────────────────────────────

export interface IMatch {

    _id: string
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

    _id: string
    steamId: string
    username: string
    matchId: string
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

    _id: string
    matchId: string
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