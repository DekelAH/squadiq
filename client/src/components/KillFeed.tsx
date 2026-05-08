import { useMatchStore } from '../store/matchStore'
import { IEvent, KillPayload, RevivePayload, CapturePayload } from '../types'

function EventRow({ event }: { event: IEvent }) {
    const ts = new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })

    if (event.type === 'kill') {
        const p = event.payload as KillPayload
        return (
            <div className="flex items-center gap-2 px-4 py-2 border-b border-surface-3 hover:bg-surface-2/50 transition-colors">
                <span className="text-xs font-mono text-slate-500 w-16 shrink-0">{ts}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-team2 shrink-0" />
                <span className="text-sm text-slate-200 font-medium truncate">{p.killerName}</span>
                <span className="text-xs text-slate-500 shrink-0">killed</span>
                <span className="text-sm text-slate-400 truncate">{p.victimName}</span>
                <span className="ml-auto text-xs font-mono text-slate-500 shrink-0 truncate">{p.weapon}</span>
            </div>
        )
    }

    if (event.type === 'revive') {
        const p = event.payload as RevivePayload
        return (
            <div className="flex items-center gap-2 px-4 py-2 border-b border-surface-3 hover:bg-surface-2/50 transition-colors">
                <span className="text-xs font-mono text-slate-500 w-16 shrink-0">{ts}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-military shrink-0" />
                <span className="text-sm text-military font-medium truncate">{p.medicName}</span>
                <span className="text-xs text-slate-500 shrink-0">revived</span>
                <span className="text-sm text-slate-400 truncate">{p.targetName}</span>
            </div>
        )
    }

    if (event.type === 'capture') {
        const p = event.payload as CapturePayload
        const teamColor = p.teamId === 1 ? 'text-team1-light' : 'text-team2-light'
        return (
            <div className="flex items-center gap-2 px-4 py-2 border-b border-surface-3 hover:bg-surface-2/50 transition-colors">
                <span className="text-xs font-mono text-slate-500 w-16 shrink-0">{ts}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-squad shrink-0" />
                <span className={`text-xs font-bold font-mono uppercase ${teamColor} shrink-0`}>
                    TEAM {p.teamId}
                </span>
                <span className="text-xs text-slate-500 shrink-0">captured</span>
                <span className="text-sm text-amber-squad font-medium truncate">{p.flagName}</span>
            </div>
        )
    }

    return null
}

export default function KillFeed() {
    const { events } = useMatchStore()

    return (
        <div className="bg-surface-1 border border-surface-3 rounded-lg flex flex-col h-full min-h-0">
            <div className="px-4 py-3 border-b border-surface-3 flex items-center justify-between shrink-0">
                <h2 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-400">
                    Live Feed
                </h2>
                <span className="text-xs font-mono text-slate-600">{events.length} events</span>
            </div>

            <div className="overflow-y-auto flex-1">
                {events.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-slate-600 text-sm font-mono">
                        Waiting for events...
                    </div>
                ) : (
                    events.map((event) => (
                        <EventRow key={event._id} event={event} />
                    ))
                )}
            </div>
        </div>
    )
}
