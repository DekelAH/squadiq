import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getPlayer } from "../api/players"

interface PlayerStats {

    steamId: string
    username: string
    matches: number
    totalKills: number
    totalDeaths: number
    totalRevives: number
    kd: number
}

export default function Player() {

    const { steamId } = useParams()
    const navigate = useNavigate()
    const [stats, setStats] = useState<PlayerStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        if (!steamId) return
        setLoading(true)
        getPlayer(steamId).then(res => {
            setStats(res.data)
        }).finally(() => setLoading(false))

    }, [steamId])

    if (loading) return (

        <div className="min-h-screen bg-surface flex items-center justify-center">
            <span className="text-slate-500 font-mono">Loading player...</span>
        </div>
    )

    if (!stats) return (

        <div className="min-h-screen bg-surface flex items-center justify-center">
            <span className="text-slate-500 font-mono">Player not found</span>
        </div>
    )

    const statCards = [
        
        { label: 'Matches', value: stats.matches },
        { label: 'Kills', value: stats.totalKills },
        { label: 'Deaths', value: stats.totalDeaths },
        { label: 'Revives', value: stats.totalRevives },
        { label: 'K/D Ratio', value: stats.kd },
    ]

    return (
        <div className="min-h-screen bg-surface p-6 flex flex-col gap-6">

            {/* Header */}
            <div>
                <button
                    onClick={() => navigate(-1)}
                    className="text-xs font-mono text-slate-500 hover:text-military mb-2 flex items-center gap-1 transition-colors"
                >
                    ← Back
                </button>
                <h1 className="text-2xl font-bold text-slate-100 tracking-tight">{stats.username}</h1>
                <p className="text-slate-500 font-mono text-xs mt-1">{stats.steamId}</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-5 gap-4">
                {statCards.map(({ label, value }) => (
                    <div key={label} className="bg-surface-1 border border-surface-3 rounded-lg p-4 flex flex-col gap-1">
                        <p className="text-xs font-mono uppercase tracking-widest text-slate-400">{label}</p>
                        <p className="text-3xl font-bold font-mono text-slate-100">{value}</p>
                    </div>
                ))}
            </div>

            {/* KD bar */}
            <div className="bg-surface-1 border border-surface-3 rounded-lg p-5">
                <h2 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-400 mb-4">
                    Kill / Death Breakdown
                </h2>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-military w-12 text-right">{stats.totalKills}K</span>
                    <div className="flex-1 h-3 bg-surface-2 rounded-full overflow-hidden flex">
                        <div
                            className="h-full bg-military rounded-full transition-all"
                            style={{ width: `${(stats.totalKills / (stats.totalKills + stats.totalDeaths || 1)) * 100}%` }}
                        />
                    </div>
                    <span className="text-xs font-mono text-team2-light w-12">{stats.totalDeaths}D</span>
                </div>
                <div className="flex justify-between mt-2">
                    <span className="text-xs font-mono text-slate-500">Kills</span>
                    <span className="text-xs font-mono text-slate-500">Deaths</span>
                </div>
            </div>

            {/* Revives highlight */}
            <div className="bg-surface-1 border border-surface-3 rounded-lg p-5 flex items-center justify-between">
                <div>
                    <p className="text-xs font-mono uppercase tracking-widest text-slate-400">Total Revives</p>
                    <p className="text-4xl font-bold font-mono text-military mt-1">{stats.totalRevives}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs font-mono uppercase tracking-widest text-slate-400">Revive Rate</p>
                    <p className="text-2xl font-bold font-mono text-slate-200 mt-1">
                        {stats.totalDeaths > 0 ? (stats.totalRevives / stats.matches).toFixed(1) : stats.totalRevives}
                        <span className="text-sm text-slate-500 ml-1">/ match</span>
                    </p>
                </div>
            </div>

        </div>
    )
}
