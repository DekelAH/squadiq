import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'

export interface AuthRequest extends Request {

    user?: {
        id: string,
        username: string,
        role: 'admin' | 'user'
    }
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {

    let token = req.cookies.accessToken
    const header = req.headers.authorization

    if (!token && header?.startsWith('Bearer ')) {

        token = header.slice(7)
    }

    if (!token) {

        res.status(401).json({ error: 'Unauthorized' })
        return
    }

    try {
        const payload = jwt.verify(token, env.JWT_SECRET) as { id: string, username: string, role: 'admin' | 'user' }
        req.user = payload
        next()

    } catch {

        res.status(401).json({ error: 'Invalid or expired token' })
    }
}