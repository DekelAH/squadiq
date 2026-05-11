import { useState } from 'react'
import { useServerStore } from '../store/serverStore'
import ServerStatusHeader from '../components/ServerStatusHeader'
import TicketBar from '../components/TicketBar'
import KillFeed from '../components/KillFeed'
import Leaderboard from '../components/Leaderboard'
import { startSimulator } from '../api/simulator'

export default function Dashboard() {

    const { tickets, status } = useServerStore()
    const [starting, setStarting] = useState(false)

    async function handleStart() {
        setStarting(true)
        try { await startSimulator() } finally { setStarting(false) }
    }

    const showStartButton = status !== 'online'

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

            {showStartButton && (
                <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm flex items-center justify-center z-10">
                    <div className="bg-surface-1 border border-surface-3 rounded-lg p-8 flex flex-col items-center gap-4 max-w-md">
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
                    </div>
                </div>
            )}
        </div>
    )
}
