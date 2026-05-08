import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { IEvent, IMatch, Leaderboard } from '../types'

interface MatchState {

    currentMatch: IMatch | null
    events: IEvent[]
    leaderboard: Leaderboard
    setMatch: (match: IMatch) => void
    addEvent: (event: IEvent) => void
    setLeaderboard: (entries: Leaderboard) => void
}

export const useMatchStore = create<MatchState>()(
    persist(
        (set) => ({
            currentMatch: null,
            events: [],
            leaderboard: [],
            setMatch: (match) => set({ currentMatch: match }),
            addEvent: (event) => set((state) => ({
                events: [event, ...state.events].slice(0, 50)
            })),
            setLeaderboard: (entries) => set({ leaderboard: entries })
        }),
        {
            name: 'squadiq-match',
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({ currentMatch: state.currentMatch, events: state.events })
        }
    )
)
