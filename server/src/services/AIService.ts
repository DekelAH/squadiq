import Anthropic from '@anthropic-ai/sdk'
import { Server } from 'socket.io'
import eventBus from '../events/EventBus'
import Match from '../models/Match'
import Player from '../models/Player'
import { env } from '../config/env'

const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY })

export function initAIService(io: Server) {

    eventBus.on('match:end', async (payload) => {

        const match = await Match.findById(payload._id)
        if (!match) return

        const players = await Player.find({ matchId: payload._id })

        const playerStats = players.map(p =>
            `${p.username} (Team ${p.teamId}): ${p.kills} kills, ${p.deaths} deaths, ${p.revives} revives`
        ).join('\n')

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
