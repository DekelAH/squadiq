import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login, register } from "../api/auth"
import { useAuthStore } from "../store/authStore"

export default function Auth() {

    const [mode, setMode] = useState<'login' | 'register'>('login')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const navigate = useNavigate()
    const setUser = useAuthStore(s => s.setUser)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        try {
            const res = mode === 'login'
                ? await login(username, password)
                : await register(username, password, 'user')
            setUser({ username: res.data.username, role: res.data.role })
            navigate('/')
        } catch {
            setError(mode === 'login' ? 'Invalid credentials' : 'Registration failed')
        }
    }

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center">
            <div className="bg-surface-1 border border-surface-3 rounded-lg p-8 w-96 flex flex-col gap-6">

                <div>
                    <h1 className="text-2xl font-bold font-mono text-military tracking-widest uppercase">
                        SquadIQ
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-mono uppercase tracking-widest text-slate-400">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                            className="bg-surface-2 border border-surface-3 rounded px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-military"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-mono uppercase tracking-widest text-slate-400">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className="bg-surface-2 border border-surface-3 rounded px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-military"
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm font-mono">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="bg-military text-black font-bold py-2 rounded uppercase tracking-widest text-sm hover:opacity-90 transition-opacity"
                    >
                        {mode === 'login' ? 'Sign In' : 'Register'}
                    </button>
                </form>

                <button
                    onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
                    className="text-military text-sm font-mono hover:underline text-center"
                >
                    {mode === 'login' ? "Don't have an account? Register" : 'Already have an account? Sign in'}
                </button>

            </div>
        </div>
    )
}