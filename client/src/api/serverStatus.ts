import { api } from ".";


export function getServerStatus(id:string) {

    return api.get(`/servers/${id}/status`)
}