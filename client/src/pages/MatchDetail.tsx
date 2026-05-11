import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { io } from 'socket.io-client'
import { getMatch } from "../api/matches"
import Leaderboard from "../components/Leaderboard"
import { IMatch, IEvent, AIAnalysis, KillPayload, RevivePayload, CapturePayload } from "../types"

export default function MatchDetail() {

    const { id } = useParams()
    const navigate = useNavigate()
    const [match, setMatch] = useState<IMatch | null>(null)
    const [events, setEvents] = useState<IEvent[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!id) return
        setLoading(true)
        getMatch(id).then(res => {
            setMatch(res.data.match)
            setEvents(res.data.events)
        }).finally(() => setLoading(false))

        const socket = io({ withCredentials: true })
        socket.on('match:analysis_ready', (payload: { matchId: string; analysis: AIAnalysis }) => {
            if (payload.matchId === id) {
                setMatch(prev => prev ? { ...prev, aiAnalysis: payload.analysis } : prev)
            }
        })
        return () => { socket.disconnect() }
    }, [id])

    if (loading) return (
        <div className="min-h-screen bg-surface flex items-center justify-center">
            <span className="text-slate-500 font-mono">Loading match...</span>
        </div>
    )

    if (!match) return (
        <div className="min-h-screen bg-surface flex items-center justify-center">
            <span className="text-slate-500 font-mono">Match not found</span>
        </div>
    )

    return (
        <div className="min-h-screen bg-surface p-6 flex flex-col gap-6">

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <button
                        onClick={() => navigate('/matches')}
                        className="text-xs font-mono text-slate-500 hover:text-military mb-2 flex items-center gap-1 transition-colors"
                    >
                        ← Back to matches
                    </button>
                    <h1 className="text-2xl font-bold text-slate-100 tracking-tight">{match.map}</h1>
                    <p className="text-slate-400 font-mono text-sm mt-1">{match.layer}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded text-xs font-bold font-mono uppercase tracking-wider ${
                        match.winner === 1 ? 'bg-team1/20 text-team1-light border border-team1/30' : 'bg-team2/20 text-team2-light border border-team2/30'
                    }`}>
                        Team {match.winner} Won
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                        {new Date(match.startedAt).toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Ticket summary */}
            <div className="grid grid-cols-2 gap-4">
                {([1, 2] as const).map(team => (
                    <div key={team} className="bg-surface-1 border border-surface-3 rounded-lg p-4">
                        <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-1">
                            Team {team}
                        </p>
                        <p className={`text-3xl font-bold font-mono ${team === 1 ? 'text-team1-light' : 'text-team2-light'}`}>
                            {team === 1 ? match.tickets.team1 : match.tickets.team2}
                            <span className="text-sm text-slate-500 ml-1">tickets</span>
                        </p>
                        {match.winner === team && (
                            <span className="text-xs text-military font-mono mt-1 block">★ Winner</span>
                        )}
                    </div>
                ))}
            </div>

            {/* AI Analysis card */}
            <div className="bg-surface-1 border border-military/30 rounded-lg p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xs font-bold font-mono uppercase tracking-widest text-military">
                        GPT-4o Round Diagnostics
                    </h2>
                    {!match.aiAnalysis && match.status === 'ended' && (
                        <span className="text-xs font-mono text-slate-500 animate-pulse">
                            Generating analysis...
                        </span>
                    )}
                    {!match.aiAnalysis && match.status === 'in_progress' && (
                        <span className="text-xs font-mono text-slate-500">
                            Available when match ends
                        </span>
                    )}
                </div>

                {match.aiAnalysis ? (
                    <>
                        <p className="text-slate-300 text-sm leading-relaxed">{match.aiAnalysis.summary}</p>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            {(
                                [
                                    ['MVP', match.aiAnalysis.mvp],
                                    ['Top Medic', match.aiAnalysis.topMedic],
                                    ['Turning Point', match.aiAnalysis.turningPoint],
                                    ['Tactical Tip', match.aiAnalysis.tacticalTip],
                                    ['Team 1 Strengths', match.aiAnalysis.team1Strengths],
                                    ['Team 2 Weaknesses', match.aiAnalysis.team2Weaknesses],
                                ] as [string, string][]
                            ).map(([label, value]) => (
                                <div key={label} className="bg-surface-2 rounded p-3">
                                    <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-1">{label}</p>
                                    <p className="text-slate-200">{value}</p>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-24 text-slate-600 font-mono text-sm">
                        No analysis available yet
                    </div>
                )}
            </div>

            {/* Leaderboard */}
            <div className="h-96">
                <Leaderboard events={events} />
            </div>

            {/* Events timeline */}
            <div className="bg-surface-1 border border-surface-3 rounded-lg flex flex-col">
                <div className="px-4 py-3 border-b border-surface-3">
                    <h2 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-400">
                        Event Timeline
                        <span className="ml-2 text-slate-600">{events.length} events</span>
                    </h2>
                </div>
                <div className="overflow-y-auto max-h-96">
                    {events.length === 0 ? (
                        <div className="flex items-center justify-center h-24 text-slate-600 font-mono text-sm">
                            No events recorded
                        </div>
                    ) : events.map(event => {
                        const ts = new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                        if (event.type === 'kill') {
                            const p = event.payload as KillPayload
                            return (
                                <div key={event._id} className="flex items-center gap-2 px-4 py-2 border-b border-surface-3 text-sm">
                                    <span className="text-xs font-mono text-slate-500 w-16 shrink-0">{ts}</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-team2 shrink-0" />
                                    <span className="text-slate-200 font-medium">{p.killerName}</span>
                                    <span className="text-slate-500 text-xs">killed</span>
                                    <span className="text-slate-400">{p.victimName}</span>
                                    <span className="ml-auto text-xs font-mono text-slate-500">{p.weapon}</span>
                                </div>
                            )
                        }
                        if (event.type === 'revive') {
                            const p = event.payload as RevivePayload
                            return (
                                <div key={event._id} className="flex items-center gap-2 px-4 py-2 border-b border-surface-3 text-sm">
                                    <span className="text-xs font-mono text-slate-500 w-16 shrink-0">{ts}</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-military shrink-0" />
                                    <span className="text-military font-medium">{p.medicName}</span>
                                    <span className="text-slate-500 text-xs">revived</span>
                                    <span className="text-slate-400">{p.targetName}</span>
                                </div>
                            )
                        }
                        if (event.type === 'capture') {
                            const p = event.payload as CapturePayload
                            return (
                                <div key={event._id} className="flex items-center gap-2 px-4 py-2 border-b border-surface-3 text-sm">
                                    <span className="text-xs font-mono text-slate-500 w-16 shrink-0">{ts}</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-squad shrink-0" />
                                    <span className={`text-xs font-bold font-mono ${p.teamId === 1 ? 'text-team1-light' : 'text-team2-light'}`}>TEAM {p.teamId}</span>
                                    <span className="text-slate-500 text-xs">captured</span>
                                    <span className="text-amber-squad">{p.flagName}</span>
                                </div>
                            )
                        }
                        return null
                    })}
                </div>
            </div>

        </div>
    )
}
