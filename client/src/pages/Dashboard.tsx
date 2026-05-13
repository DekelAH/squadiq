import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useServerStore } from '../store/serverStore'
import { useMatchStore } from '../store/matchStore'
import ServerStatusHeader from '../components/ServerStatusHeader'
import TicketBar from '../components/TicketBar'
import KillFeed from '../components/KillFeed'
import Leaderboard from '../components/Leaderboard'
import { startSimulator } from '../api/simulator'

export default function Dashboard() {

    const { tickets, status } = useServerStore()
    const currentMatch = useMatchStore(s => s.currentMatch)
    const [starting, setStarting] = useState(false)
    const navigate = useNavigate()

    async function handleStart() {
        setStarting(true)
        try { await startSimulator() } finally { setStarting(false) }
    }

    const showOverlay = status !== 'online'
    const matchJustEnded = showOverlay && currentMatch?.status === 'ended'

    return (
        <div className="flex flex-col h-screen overflow-hidden relative">

            <ServerStatusHeader />

            <div className="flex-1 flex flex-col gap-4 p-4 overflow-hidden">

                <div className="grid grid-cols-2 gap-4 shrink-0">
                    <TicketBar team={1} current={tickets.team1} />
                    <TicketBar team={2} current={tickets.team2} />
                </div>

                <div className="grid grid-cols-2 gap-4 flex-1 overflow-hidden">
                    <KillFeed />
                    <Leaderboard />
                </div>
            </div>

            {showOverlay && (
                <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm flex items-center justify-center z-10">
                    <div className="bg-surface-1 border border-surface-3 rounded-lg p-8 flex flex-col items-center gap-4 max-w-md">
                        {matchJustEnded ? (
                            <>
                                <h2 className="text-lg font-bold font-mono uppercase tracking-widest text-slate-100">
                                    Match Ended
                                </h2>
                                <p className="text-slate-400 text-sm text-center font-mono">
                                    Team {currentMatch!.winner} wins — view the full breakdown and AI analysis.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => navigate(`/matches/${currentMatch!._id}`)}
                                        className="bg-military text-black font-bold px-6 py-2 rounded uppercase tracking-widest text-sm hover:opacity-90 transition-opacity"
                                    >
                                        View Match
                                    </button>
                                    <button
                                        onClick={handleStart}
                                        disabled={starting}
                                        className="bg-surface-2 border border-surface-3 text-slate-300 font-bold px-6 py-2 rounded uppercase tracking-widest text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
                                    >
                                        {starting ? 'Starting...' : 'New Match'}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 className="text-lg font-bold font-mono uppercase tracking-widest text-slate-100">
                                    No Active Match
                                </h2>
                                <p className="text-slate-400 text-sm text-center font-mono">
                                    Start a new simulated match to see live events.
                                </p>
                                <button
                                    onClick={handleStart}
                                    disabled={starting}
                                    className="bg-military text-black font-bold px-6 py-2 rounded uppercase tracking-widest text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
                                >
                                    {starting ? 'Starting...' : 'Start Match'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
