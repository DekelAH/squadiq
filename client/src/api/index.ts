import axios, { AxiosInstance } from 'axios'
import { useAuthStore } from '../store/authStore'


export const api: AxiosInstance = axios.create({

    baseURL: '/api',
    withCredentials: true
})


api.interceptors.response.use(
    
    (res) => res,
    async (err) => {
        if (err.response?.status === 401) {
            try {

                await api.post('/auth/refresh')
                return api(err.config)

            } catch {

                useAuthStore.getState().logout()
            }
        }
        
        return Promise.reject(err)
    }
)