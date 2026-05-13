import Anthropic from '@anthropic-ai/sdk'
import { Server } from 'socket.io'
import eventBus from '../events/EventBus'
import Match from '../models/Match'
import Event from '../models/Event'
import { env } from '../config/env'

const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY })

export function initAIService(io: Server) {

    eventBus.on('match:end', async (payload) => {

        const match = await Match.findById(payload._id)
        if (!match) return

        const events = await Event.find({ matchId: payload._id })

        const statsMap: Record<string, { username: string; teamId: number; kills: number; deaths: number; revives: number }> = {}

        for (const ev of events) {
            if (ev.type === 'kill') {
                const { killerId, killerName, victimId, victimName, teamId } = ev.payload as any
                if (!statsMap[killerId]) statsMap[killerId] = { username: killerName, teamId, kills: 0, deaths: 0, revives: 0 }
                if (!statsMap[victimId]) statsMap[victimId] = { username: victimName, teamId: teamId === 1 ? 2 : 1, kills: 0, deaths: 0, revives: 0 }
                statsMap[killerId].kills++
                statsMap[victimId].deaths++
            } else if (ev.type === 'revive') {
                const { medicId, medicName, teamId } = ev.payload as any
                if (!statsMap[medicId]) statsMap[medicId] = { username: medicName, teamId, kills: 0, deaths: 0, revives: 0 }
                statsMap[medicId].revives++
            }
        }

        const playerStats = Object.values(statsMap)
            .map(p => `${p.username} (Team ${p.teamId}): ${p.kills} kills, ${p.deaths} deaths, ${p.revives} revives`)
            .join('\n')

        try {
            const prompt = `You are a military tactics analyst for the game Squad.
Match: ${match.map} - ${match.layer}
Winner: Team ${match.winner}
Tickets remaining - Team 1: ${match.tickets.team1}, Team 2: ${match.tickets.team2}

Player stats:
${playerStats}

Respond ONLY with a raw JSON object (no markdown, no code fences) with exactly these fields:
summary, mvp, topMedic, turningPoint, team1Strengths, team2Weaknesses, tacticalTip`

            const response = await anthropic.messages.create({
                model: env.CLAUDE_MODEL,
                max_tokens: 1024,
                messages: [{ role: 'user', content: prompt }],
            })

            const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
            const analysis = JSON.parse(text)

            match.aiAnalysis = analysis
            await match.save()

            io.emit('match:analysis_ready', { matchId: match._id, analysis })
        } catch (err) {
            console.error('AI analysis failed:', err)
        }
    })
}
