import { useSocket } from "./hooks/useSocket"
import { BrowserRouter, Routes, Route } from 'react-router-dom'

export default function App() {

    useSocket()
    return (

        <BrowserRouter>
            <Routes>
                <Route path="/" element={<div>Home</div>} /> {/* Dashboard page */}
                <Route path="/matches" element={<div>Matches</div>} /> {/* Matches page */}
                <Route path="/matches/:id" element={<div>Match</div>} /> {/* Match Detail page */}
                <Route path="/players/:steamId" element={<div>Players</div>} /> {/* Player page */}
                <Route path="/auth" element={<div>Auth</div>} /> {/* Auth page */}
            </Routes>
        </BrowserRouter>
    )
}