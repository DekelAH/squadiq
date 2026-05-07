import { create } from 'zustand'

interface ServerState {

    serverId: string,
    status: 'online' | 'offline',
    playerCount: number,
    map: string,
    layer: string,
    tickets: { team1: number, team2: number }
    setServerStatus: (status: Omit<ServerState, 'setServerStatus'>) => void
}

export const useServerStore = create<ServerState>((set) => ({

    serverId: '',
    status: 'offline',
    playerCount: 0,
    map: '',
    layer: '',
    tickets: { team1: 0, team2: 0 },
    setServerStatus: (status) => set(status)
}))