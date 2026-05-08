import { useServerStore } from '../store/serverStore'
import { useMatchStore } from '../store/matchStore'

export default function ServerStatusHeader() {
    const { map, layer, status, serverId } = useServerStore()
    const { currentMatch } = useMatchStore()

    return (
        <header className="bg-surface-1 border-b border-surface-3 px-6 py-4">
            <div className="flex items-center justify-between">

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${status === 'online' ? 'bg-military animate-pulse' : 'bg-slate-500'}`} />
                        <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                            {serverId || 'demo-server-1'}
                        </span>
                    </div>

                    <div className="h-4 w-px bg-surface-3" />

                    <div>
                        <span className="text-xl font-bold text-slate-100 tracking-tight">
                            {map || '—'}
                        </span>
                        <span className="ml-3 text-sm text-slate-400 font-mono">
                            {layer || '—'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {currentMatch && (
                        <span className="text-xs font-mono text-slate-500">
                            MATCH {currentMatch._id.slice(-6).toUpperCase()}
                        </span>
                    )}
                    <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                        status === 'online'
                            ? 'bg-military/20 text-military border border-military/40'
                            : 'bg-slate-700/40 text-slate-500 border border-slate-600/40'
                    }`}>
                        {status === 'online' ? 'Live' : 'Offline'}
                    </span>
                </div>
            </div>
        </header>
    )
}
