import { useState } from 'react'
import { useMatchStore } from '../store/matchStore'
import { LeaderboardEntry } from '../types'

type SortKey = 'kills' | 'deaths' | 'revives' | 'kd'

function buildLeaderboard(events: ReturnType<typeof useMatchStore.getState>['events']): LeaderboardEntry[] {
    const map = new Map<string, LeaderboardEntry>()

    for (const event of events) {
        if (event.type === 'kill') {
            const p = event.payload as { killerId: string; killerName: string; victimId: string; victimName: string; teamId: 1 | 2 }

            if (!map.has(p.killerId)) {
                map.set(p.killerId, { steamId: p.killerId, username: p.killerName, teamId: p.teamId, kills: 0, deaths: 0, revives: 0, kd: 0 })
            }
            if (!map.has(p.victimId)) {
                map.set(p.victimId, { steamId: p.victimId, username: p.victimName, teamId: p.teamId === 1 ? 2 : 1, kills: 0, deaths: 0, revives: 0, kd: 0 })
            }

            map.get(p.killerId)!.kills++
            map.get(p.victimId)!.deaths++
        }

        if (event.type === 'revive') {
            const p = event.payload as { medicId: string; medicName: string; teamId: 1 | 2 }
            if (!map.has(p.medicId)) {
                map.set(p.medicId, { steamId: p.medicId, username: p.medicName, teamId: p.teamId, kills: 0, deaths: 0, revives: 0, kd: 0 })
            }
            map.get(p.medicId)!.revives++
        }
    }

    return Array.from(map.values()).map(p => ({
        ...p,
        kd: p.deaths === 0 ? p.kills : parseFloat((p.kills / p.deaths).toFixed(2))
    }))
}

export default function Leaderboard() {
    const { events } = useMatchStore()
    const [sortKey, setSortKey] = useState<SortKey>('kills')

    const entries = buildLeaderboard(events).sort((a, b) => b[sortKey] - a[sortKey])

    const cols: { key: SortKey; label: string }[] = [
        { key: 'kills', label: 'K' },
        { key: 'deaths', label: 'D' },
        { key: 'revives', label: 'R' },
        { key: 'kd', label: 'K/D' },
    ]

    return (
        <div className="bg-surface-1 border border-surface-3 rounded-lg flex flex-col h-full min-h-0">
            <div className="px-4 py-3 border-b border-surface-3 flex items-center justify-between shrink-0">
                <h2 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-400">
                    Leaderboard
                </h2>
                <div className="flex gap-1">
                    {cols.map(col => (
                        <button
                            key={col.key}
                            onClick={() => setSortKey(col.key)}
                            className={`px-2 py-0.5 text-xs font-mono rounded transition-colors ${
                                sortKey === col.key
                                    ? 'bg-military text-white'
                                    : 'text-slate-500 hover:text-slate-300'
                            }`}
                        >
                            {col.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-y-auto flex-1">
                {entries.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-slate-600 text-sm font-mono">
                        No players yet...
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-surface-1">
                            <tr className="border-b border-surface-3">
                                <th className="text-left px-4 py-2 text-xs font-mono text-slate-500 uppercase">#</th>
                                <th className="text-left px-4 py-2 text-xs font-mono text-slate-500 uppercase">Player</th>
                                <th className="text-center px-2 py-2 text-xs font-mono text-slate-500 uppercase">K</th>
                                <th className="text-center px-2 py-2 text-xs font-mono text-slate-500 uppercase">D</th>
                                <th className="text-center px-2 py-2 text-xs font-mono text-slate-500 uppercase">R</th>
                                <th className="text-center px-2 py-2 text-xs font-mono text-slate-500 uppercase">K/D</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.map((entry, i) => {
                                const teamColor = entry.teamId === 1 ? 'text-team1-light' : 'text-team2-light'
                                return (
                                    <tr key={entry.steamId} className="border-b border-surface-3/50 hover:bg-surface-2/50 transition-colors">
                                        <td className="px-4 py-2 text-xs font-mono text-slate-600">{i + 1}</td>
                                        <td className="px-4 py-2">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${entry.teamId === 1 ? 'bg-team1' : 'bg-team2'}`} />
                                                <span className={`font-medium truncate max-w-[100px] ${teamColor}`}>{entry.username}</span>
                                            </div>
                                        </td>
                                        <td className="text-center px-2 py-2 font-mono text-slate-200">{entry.kills}</td>
                                        <td className="text-center px-2 py-2 font-mono text-slate-400">{entry.deaths}</td>
                                        <td className="text-center px-2 py-2 font-mono text-military">{entry.revives}</td>
                                        <td className="text-center px-2 py-2 font-mono text-amber-squad font-bold">{entry.kd}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
}
