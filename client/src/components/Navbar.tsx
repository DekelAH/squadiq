import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { logout } from '../api/auth'

export default function Navbar() {

    const { user, logout: clearAuth } = useAuthStore()
    const navigate = useNavigate()

    async function handleLogout() {
        await logout()
        clearAuth()
        navigate('/auth')
    }

    return (
        <nav className="bg-surface-1 border-b border-surface-3 px-6 py-2 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-6">
                <span className="text-military font-mono font-bold tracking-widest text-sm uppercase">
                    SquadIQ
                </span>
                <div className="flex items-center gap-1">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            `px-3 py-1.5 rounded text-xs font-mono uppercase tracking-widest transition-colors ${
                                isActive
                                    ? 'bg-military/20 text-military'
                                    : 'text-slate-400 hover:text-slate-100'
                            }`
                        }
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/matches"
                        className={({ isActive }) =>
                            `px-3 py-1.5 rounded text-xs font-mono uppercase tracking-widest transition-colors ${
                                isActive
                                    ? 'bg-military/20 text-military'
                                    : 'text-slate-400 hover:text-slate-100'
                            }`
                        }
                    >
                        Matches
                    </NavLink>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {user && (
                    <span className="text-xs font-mono text-slate-500">
                        {user.username}
                        <span className="ml-2 px-1.5 py-0.5 bg-surface-2 rounded text-slate-600 uppercase">
                            {user.role}
                        </span>
                    </span>
                )}
                <button
                    onClick={handleLogout}
                    className="text-xs font-mono uppercase tracking-widest text-slate-500 hover:text-red-400 transition-colors"
                >
                    Logout
                </button>
            </div>
        </nav>
    )
}
