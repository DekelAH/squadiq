import { Router, Request, Response } from 'express'
import Match from '../models/Match'

const router = Router()

router.get('/:id/status', async (req: Request, res: Response): Promise<void> => {

    try {

        const { id } = req.params
        const match = await Match.findOne({ serverId: id, status: 'in_progress' })
        if (!match) {

            res.json({ status: 'offline' })
            return
        }
        res.json({ status: 'online', match })

    } catch (err) {
        res.status(500).json({ error: 'No server found' })
    }
})

export default router