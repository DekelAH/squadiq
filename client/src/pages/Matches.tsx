import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMatches } from "../api/matches";
import { IMatch } from "../types";

export default function Matches() {

    const [matches, setMatches] = useState<IMatch[]>([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        setLoading(true)
        getMatches(page).then(res => {
            setMatches(res.data.matches)
            setTotalPages(res.data.pages)
        }).finally(() => setLoading(false))
    }, [page])

    return (
        <div className="min-h-screen bg-surface p-6">

            <div className="mb-6">
                <h1 className="text-xl font-bold font-mono uppercase tracking-widest text-slate-100">
                    Match History
                </h1>
                <p className="text-slate-500 text-sm font-mono mt-1">All completed matches</p>
            </div>

            <div className="bg-surface-1 border border-surface-3 rounded-lg overflow-hidden">

                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-surface-3 text-xs font-mono uppercase tracking-widest text-slate-400">
                            <th className="px-4 py-3 text-left">Map</th>
                            <th className="px-4 py-3 text-left">Layer</th>
                            <th className="px-4 py-3 text-left">Winner</th>
                            <th className="px-4 py-3 text-left">Tickets Left</th>
                            <th className="px-4 py-3 text-left">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-12 text-center text-slate-500 font-mono">
                                    Loading...
                                </td>
                            </tr>
                        ) : matches.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-12 text-center text-slate-500 font-mono">
                                    No matches found
                                </td>
                            </tr>
                        ) : matches.map(match => (
                            <tr
                                key={match._id}
                                onClick={() => navigate(`/matches/${match._id}`)}
                                className="border-b border-surface-3 hover:bg-surface-2/50 cursor-pointer transition-colors"
                            >
                                <td className="px-4 py-3 text-slate-100 font-medium">{match.map}</td>
                                <td className="px-4 py-3 text-slate-400 font-mono">{match.layer}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${match.winner === 1 ? 'bg-team1/20 text-team1-light' : 'bg-team2/20 text-team2-light'}`}>
                                        Team {match.winner ?? '—'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-slate-400 font-mono">
                                    {match.tickets.team1} / {match.tickets.team2}
                                </td>
                                <td className="px-4 py-3 text-slate-500 font-mono text-xs">
                                    {new Date(match.startedAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between mt-4">
                <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-surface-1 border border-surface-3 rounded text-sm font-mono text-slate-400 hover:text-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    ← Prev
                </button>
                <span className="text-xs font-mono text-slate-500">
                    Page {page} of {totalPages}
                </span>
                <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-surface-1 border border-surface-3 rounded text-sm font-mono text-slate-400 hover:text-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    Next →
                </button>
            </div>
        </div>
    )
}