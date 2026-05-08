import { useMatchStore } from '../store/matchStore'
import { useServerStore } from '../store/serverStore'
import ServerStatusHeader from '../components/ServerStatusHeader'
import TicketBar from '../components/TicketBar'
import KillFeed from '../components/KillFeed'
import Leaderboard from '../components/Leaderboard'
import { KillPayload } from '../types'

export default function Dashboard() {
    const { currentMatch, events } = useMatchStore()
    const { tickets } = useServerStore()

    const initialTeam1 = currentMatch?.tickets.team1 ?? tickets.team1
    const initialTeam2 = currentMatch?.tickets.team2 ?? tickets.team2

    const killsByTeam1 = events.filter(e => e.type === 'kill' && (e.payload as KillPayload).teamId === 1).length
    const killsByTeam2 = events.filter(e => e.type === 'kill' && (e.payload as KillPayload).teamId === 2).length

    const liveTeam1 = Math.max(0, initialTeam1 - killsByTeam2)
    const liveTeam2 = Math.max(0, initialTeam2 - killsByTeam1)

    return (
        <div className="flex flex-col h-screen overflow-hidden">

            <ServerStatusHeader />

            <div className="flex-1 flex flex-col gap-4 p-4 overflow-hidden">

                <div className="grid grid-cols-2 gap-4 shrink-0">
                    <TicketBar
                        team={1}
                        current={liveTeam1}
                    />
                    <TicketBar
                        team={2}
                        current={liveTeam2}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 flex-1 overflow-hidden">
                    <KillFeed />
                    <Leaderboard />
                </div>
            </div>
        </div>
    )
}
