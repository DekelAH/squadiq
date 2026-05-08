interface TicketBarProps {
    team: 1 | 2
    current: number
    max?: number
}

export default function TicketBar({ team, current, max = 300 }: TicketBarProps) {
    const pct = Math.max(0, Math.min(100, (current / max) * 100))
    const isTeam1 = team === 1

    const barColor = isTeam1 ? 'bg-team1' : 'bg-team2'
    const borderColor = isTeam1 ? 'border-team1/40' : 'border-team2/40'
    const textColor = isTeam1 ? 'text-team1-light' : 'text-team2-light'
    const label = isTeam1 ? 'TEAM 1' : 'TEAM 2'

    const urgency = pct < 20 ? 'animate-pulse' : ''

    return (
        <div className={`bg-surface-1 border ${borderColor} rounded-lg p-4`}>
            <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-bold font-mono tracking-widest uppercase ${textColor}`}>
                    {label}
                </span>
                <span className={`text-2xl font-bold font-mono ${textColor} ${urgency}`}>
                    {current}
                </span>
            </div>

            <div className="w-full bg-surface-3 rounded-full h-3 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${barColor} ${urgency}`}
                    style={{ width: `${pct}%` }}
                />
            </div>

            <div className="flex justify-between mt-1.5">
                <span className="text-xs text-slate-600 font-mono">0</span>
                <span className="text-xs text-slate-600 font-mono">{max}</span>
            </div>
        </div>
    )
}
