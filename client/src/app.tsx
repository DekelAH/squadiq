import { useEffect } from "react"
import { useSocket } from "./hooks/useSocket"
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { getMe } from './api/auth'
import Navbar from './components/Navbar'

import Dashboard from './pages/Dashboard'
import Matches from "./pages/Matches"
import MatchDetail from "./pages/MatchDetail"
import Player from "./pages/Player"
import Auth from "./pages/Auth"

function ProtectedRoute() {
    const { isAuthenticated, isLoading } = useAuthStore()
    if (isLoading) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center">
                <span className="text-slate-500 font-mono">Loading...</span>
            </div>
        )
    }
    if (!isAuthenticated) return <Navigate to="/auth" />
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    )
}

export default function App() {

    useSocket()

    useEffect(() => {
        getMe()
            .then(res => useAuthStore.getState().setUser({ username: res.data.username, role: res.data.role }))
            .catch(() => useAuthStore.getState().setUser(null))
            .finally(() => useAuthStore.getState().setLoading(false))
    }, [])

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/matches" element={<Matches />} />
                    <Route path="/matches/:id" element={<MatchDetail />} />
                    <Route path="/players/:steamId" element={<Player />} />
                </Route>
                <Route path="/auth" element={<Auth />} />
            </Routes>
        </BrowserRouter>
    )
}


