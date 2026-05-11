import { api } from "."


export function login(username: string, password: string) {

    return api.post('/auth/login', { username, password })
}

export function register(username: string, password: string, role: string) {

    return api.post('/auth/register', { username, password, role })
}

export function logout() {

    return api.post('/auth/logout')
}

export function getMe() {

    return api.get('/auth/me')
}