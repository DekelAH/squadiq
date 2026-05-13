import axios, { AxiosInstance } from 'axios'
import { useAuthStore } from '../store/authStore'


export const api: AxiosInstance = axios.create({

    baseURL: `${import.meta.env.VITE_API_URL ?? ''}/api`,
    withCredentials: true
})


api.interceptors.response.use(

    (res) => res,
    async (err) => {
        const isRefreshCall = err.config?.url?.includes('/auth/refresh')

        if (err.response?.status === 401 && !isRefreshCall) {
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