import { Router, Response } from 'express'
import Match from '../models/Match'
import Event from '../models/Event'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()
router.get('/', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {

    try {

        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 10

        const matches = await Match.find().sort({ 'startedAt': -1 }).skip((page - 1) * limit).limit(limit)
        const totalCount = await Match.countDocuments()

        res.status(200).json({
            matches,
            totalCount,
            page,
            pages: Math.ceil(totalCount / limit)
        })

    } catch (err) {

        res.status(500).json({ error: 'Couldnt fetch matches' })
    }
})

router.get('/:id', requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {

    const { id } = req.params
    try {

        const match = await Match.findById(id)
        if (!match) {
            res.status(404).json({ error: 'Match not found' })
            return
        }

        const events = await Event.find({ matchId: id }).sort({ timestamp: 1 })
        res.status(200).json({ match, events })

    } catch (err) {
        res.status(500).json({ error: 'Couldnt fetch match' })
    }
})

export default router