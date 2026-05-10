import OpenAI from 'openai'
import { Server } from 'socket.io'
import eventBus from '../events/EventBus'
import Match from '../models/Match'
import Player from '../models/Player'
import { env } from '../config/env'

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY })

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
                            
                            Respond in JSON with these fields: summary, mvp, topMedic, turningPoint, team1Strengths, team2Weaknesses, tacticalTip`

            const response = await openai.chat.completions.create({
                model: env.OPENAI_MODEL,
                messages: [{ role: 'user', content: prompt }],
                response_format: { type: 'json_object' }
            })

            const analysis = JSON.parse(response.choices[0].message.content ?? '{}')
            match.aiAnalysis = analysis
            await match.save()

            io.emit('match:analysis_ready', { matchId: match._id, analysis })
        } catch (err) {
            console.error('Couldnt create AI analysis', err)
        }
    })
}