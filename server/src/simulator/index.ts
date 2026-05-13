import eventBus from "../events/EventBus"
import Match from "../models/Match"
import { startPersisting } from "../events/EventPersister"
import { TeamId } from "../types"

const maps: { map: string, layer: string }[] = [
    { map: 'Al Basrah', layer: 'RAAS' },
    { map: 'Narva', layer: 'AAS' },
    { map: 'Mutaha', layer: 'TC' },
    { map: 'Yehorivka', layer: 'Skirmish' },
    { map: 'Goose Bay', layer: 'RAAS' }
]

const flags = ['Crossroads', 'North Compound', 'Bridge', 'Radio Tower', 'South Cache']

const players: { steamId: string, username: string, teamId: TeamId }[] = [

    { steamId: '23940234809589065', username: 'Tapu', teamId: 1 },
    { steamId: '12398435348834543', username: 'Jack', teamId: 1 },
    { steamId: '91989273848484844', username: 'Kam', teamId: 1 },
    { steamId: '36182378784782374', username: 'Snow', teamId: 1 },
    { steamId: '91023891389123222', username: 'Bugti', teamId: 1 },
    { steamId: '73172732173232344', username: 'Poll', teamId: 2 },
    { steamId: '91747473654735435', username: 'Rich', teamId: 2 },
    { steamId: '82374893249234232', username: 'Ben', teamId: 2 },
    { steamId: '91283832748937442', username: 'Tom', teamId: 2 },
    { steamId: '12882378947328974', username: 'Dan', teamId: 2 }
]

const weapons: string[] = ['AK-47', 'M-16', 'AKS', 'M-4', 'EF-88', 'RPK', 'QBZ', 'AK-12']

let isRunning = false

export function isSimulatorRunning(): boolean {
    return isRunning
}

export async function startSimulator() {

    if (isRunning) return
    isRunning = true

    const randomMap = randomFrom(maps)
    const match = new Match({
        serverId: 'demo-server-1',
        map: randomMap.map,
        layer: randomMap.layer,
        status: 'in_progress',
        startedAt: new Date(),
        tickets: { team1: 50, team2: 50 }
    })
    await match.save()
    startPersisting(match._id.toString())
    eventBus.emit('match:start', {

        _id: match._id.toString(),
        serverId: match.serverId,
        map: match.map,
        layer: match.layer,
        status: match.status,
        startedAt: match.startedAt,
        tickets: match.tickets
    })

    const deadPlayers: { steamId: string, username: string, teamId: TeamId }[] = []

    const interval = setInterval(async () => {

        let roll = Math.random()
        if (roll < 0.6) {

            const killerTeam: TeamId = Math.random() < 0.5 ? 1 : 2
            const victimTeam: TeamId = killerTeam === 1 ? 2 : 1

            const aliveVictims = players.filter(p =>
                p.teamId === victimTeam &&
                !deadPlayers.some(d => d.steamId === p.steamId)
            )
            if (aliveVictims.length === 0) return

            const killer = randomFrom(players.filter(p => p.teamId === killerTeam))
            const victim = randomFrom(aliveVictims)
            let weapon = randomFrom(weapons)

            eventBus.emit('event:kill', {

                killerId: killer.steamId,
                killerName: killer.username,
                victimId: victim.steamId,
                victimName: victim.username,
                weapon: weapon,
                teamId: killerTeam
            })

            deadPlayers.push(victim)
            if (victimTeam === 1) {
                match.tickets.team1 -= 1
            } else {
                match.tickets.team2 -= 1
            }
            eventBus.emit('tickets:update', { team1: match.tickets.team1, team2: match.tickets.team2 })
        } else if (roll < 0.85) {

            if (deadPlayers.length === 0) return

            const target = deadPlayers.shift()!
            const medic = randomFrom(players.filter(p =>
                p.teamId === target.teamId && p.steamId !== target.steamId
            ))

            eventBus.emit('event:revive', {

                medicId: medic.steamId,
                medicName: medic.username,
                targetId: target.steamId,
                targetName: target.username,
                teamId: target.teamId
            })
        } else {

            const randomTeam: TeamId = Math.random() < 0.5 ? 1 : 2
            const randomFlag = randomFrom(flags)

            eventBus.emit('event:capture', {
                flagName: randomFlag,
                teamId: randomTeam
            })
        }

        if (match.tickets.team1 <= 0 || match.tickets.team2 <= 0) {
            clearInterval(interval)
            match.status = 'ended'
            match.winner = match.tickets.team1 <= 0 ? 2 : 1
            match.endedAt = new Date()
            match.markModified('tickets')
            await match.save()
            eventBus.emit('match:end', {

                _id: match._id.toString(),
                serverId: match.serverId,
                map: match.map,
                layer: match.layer,
                winner: match.winner,
                status: match.status,
                endedAt: match.endedAt,
                tickets: match.tickets
            })

            isRunning = false
        }
    }, 500)
}

function randomFrom<T>(arr: T[]): T {

    let index = Math.floor(Math.random() * arr.length)
    return arr[index]
}