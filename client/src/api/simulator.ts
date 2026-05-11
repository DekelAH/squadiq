import { api } from "."

export function getSimulatorStatus() {
    return api.get('/simulator/status')
}

export function startSimulator() {
    return api.post('/simulator/start')
}
