import { Router, Response } from 'express'
import { requireAuth, AuthRequest } from '../middleware/auth'
import { startSimulator, isSimulatorRunning } from '../simulator'

const router = Router()

router.get('/status', (_req, res: Response) => {
    res.json({ running: isSimulatorRunning() })
})

router.post('/start', requireAuth, async (_req: AuthRequest, res: Response): Promise<void> => {

    if (isSimulatorRunning()) {
        res.status(409).json({ error: 'Simulator already running' })
        return
    }

    try {
        await startSimulator()
        res.status(200).json({ ok: true })
    } catch (err) {
        res.status(500).json({ error: 'Could not start simulator' })
    }
})

export default router
