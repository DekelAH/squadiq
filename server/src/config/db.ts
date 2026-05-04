import mongoose from 'mongoose'
import { env } from './env'
export async function connectDB(): Promise<void> {
    const MAX_RETRIES = 5
    const RETRY_DELAY_MS = 3000
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            await mongoose.connect(env.MONGODB_URI)
            console.log('MongoDB connected')
            return
        } catch (err) {
            console.error(`MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed:`, err)
            if (attempt === MAX_RETRIES) {
                console.error('Could not connect to MongoDB. Exiting.')
                process.exit(1)
            }
            await new Promise(res => setTimeout(res, RETRY_DELAY_MS))
        }
    }
}