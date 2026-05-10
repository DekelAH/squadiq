import { Router, Response } from 'express'
import { requireAuth, AuthRequest } from '../middleware/auth'
import Player from '../models/Player'

const router = Router()

router.get('/:steamId', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {

    try {
        const { steamId } = req.params
        const records = await Player.find({ steamId })
        if (records.length === 0) {

            res.status(404).json({ error: 'Records not found' })
            return
        }

        const totalKills = records.reduce((sum, player) => sum + player.kills, 0)
        const totalDeaths = records.reduce((sum, player) => sum + player.deaths, 0)
        const totalRevives = records.reduce((sum, player) => sum + player.revives, 0)

        res.status(200).json({
            steamId,
            username: records[0].username,
            matches: records.length,
            totalKills,
            totalDeaths,
            totalRevives,
            kd: totalDeaths === 0 ? totalKills : parseFloat((totalKills / totalDeaths).toFixed(2))
        })
    } catch (err) {

        res.status(500).json({ error: 'Fetching player stats failed' })
    }
})

export default router