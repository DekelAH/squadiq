import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import { env } from '../config/env'
import { requireAuth, AuthRequest } from '../middleware/auth'

const cookieOptions = {

    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict' as const
}

function signTokens(user: { _id: any; username: string; role: string }) {

    const id = user._id.toString()
    return {

        accessToken: jwt.sign({ id, username: user.username, role: user.role }, env.JWT_SECRET, { expiresIn: env.ACCESS_TOKEN_TTL as any }),
        refreshToken: jwt.sign({ id }, env.JWT_REFRESH_SECRET, { expiresIn: env.REFRESH_TOKEN_TTL as any }),
    }
}

const router = Router()
router.post('/register', async (req: Request, res: Response): Promise<void> => {

    try {
        const { username, password, role } = req.body
        const passwordHash = await bcrypt.hash(password, 10)

        const user = await User.create({ username, passwordHash, role })
        const tokens = signTokens(user)
        user.refreshToken = tokens.refreshToken
        await user.save()

        res.cookie('accessToken', tokens.accessToken, cookieOptions)
        res.cookie('refreshToken', tokens.refreshToken, cookieOptions)
        res.status(201).json({ username: user.username, role: user.role })

    } catch (err) {
        res.status(500).json({ error: 'Registration failed' })
    }
})

router.post('/login', async (req: Request, res: Response): Promise<void> => {

    try {
        const { username, password } = req.body
        const user = await User.findOne({ username })

        if (!user) {
            res.status(404).json({ error: 'Not Found' })
            return
        }

        const passwordMatch = await bcrypt.compare(password, user.passwordHash)
        if (!passwordMatch) {
            res.status(401).json({ error: 'Unauthorized' })
            return
        }
        const tokens = signTokens(user)
        user.refreshToken = tokens.refreshToken
        await user.save()

        res.cookie('accessToken', tokens.accessToken, cookieOptions)
        res.cookie('refreshToken', tokens.refreshToken, cookieOptions)
        res.status(200).json({ username: user.username, role: user.role })

    } catch (err) {
        res.status(500).json({ error: 'Login failed' })
    }
})

router.post('/refresh', async (req: Request, res: Response): Promise<void> => {

    try {
        const token = req.cookies.refreshToken
        if (!token) {
            res.status(401).json({ error: 'Unauthorized' })
            return
        }
        const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as { id: string }
        const user = await User.findById(payload.id)
        if (!user || user.refreshToken !== token) {
            res.status(401).json({ error: 'Unauthorized' })
            return
        }

        const { accessToken } = signTokens(user)
        res.cookie('accessToken', accessToken, cookieOptions)
        res.status(200).json({ ok: true })

    } catch (err) {
        res.status(401).json({ error: 'Invalid or expired refresh token' })
    }
})

router.post('/logout', async (req: Request, res: Response): Promise<void> => {

    try {
        const token = req.cookies.refreshToken
        if (!token) {
            res.clearCookie('accessToken')
            res.clearCookie('refreshToken')
            res.status(200).json({ ok: true })
            return
        }

        const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as { id: string }
        const user = await User.findById(payload.id)
        if (user) {
            user.refreshToken = undefined
            await user.save()
        }

        res.clearCookie('accessToken')
        res.clearCookie('refreshToken')
        res.status(200).json({ ok: true })
    } catch (err) {
        res.clearCookie('accessToken')
        res.clearCookie('refreshToken')
        res.status(200).json({ ok: true })
    }
})

router.get('/me', requireAuth, (req: AuthRequest, res: Response) => {
    res.status(200).json({ username: req.user!.username, role: req.user!.role })
})

export default router