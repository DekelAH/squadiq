import { api } from ".";



export function getMatches(page = 1, limit = 10) {

    return api.get('/matches', { params: { page, limit } })
}

export function getMatch(id: string) {

    return api.get(`/matches/${id}`)
}