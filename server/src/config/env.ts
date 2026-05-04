import { z } from 'zod'
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().default(5000),
    DEMO_MODE: z.string().transform(v => v === 'true').default('true'),
    MONGODB_URI: z.string().url(),
    JWT_SECRET: z.string().min(16),
    JWT_REFRESH_SECRET: z.string().min(16),
    ACCESS_TOKEN_TTL: z.string().default('15m'),
    REFRESH_TOKEN_TTL: z.string().default('7d'),
    OPENAI_API_KEY: z.string().startsWith('sk-'),
    OPENAI_MODEL: z.string().default('gpt-4o'),
    RCON_HOST: z.string().optional(),
    RCON_PORT: z.coerce.number().optional(),
    RCON_PASSWORD: z.string().optional(),
    CLIENT_ORIGIN: z.string().url().default('http://localhost:3000'),
})
const parsed = envSchema.safeParse(process.env)
if (!parsed.success) {
    console.error('Invalid environment variables:')
    console.error(parsed.error.flatten().fieldErrors)
    process.exit(1)
}
export const env = parsed.data