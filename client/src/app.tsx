import { useSocket } from "./hooks/useSocket"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'

export default function App() {

    useSocket()
    return (

        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/matches" element={<div>Matches</div>} />
                <Route path="/matches/:id" element={<div>Match Detail</div>} />
                <Route path="/players/:steamId" element={<div>Player</div>} />
                <Route path="/auth" element={<div>Auth</div>} />
            </Routes>
        </BrowserRouter>
    )
}