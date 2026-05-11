import { api } from ".";


export function getPlayer(steamId: string) {

    return api.get(`/players/${steamId}`)
}