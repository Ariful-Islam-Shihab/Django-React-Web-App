import axios from 'axios'
import { ACCESS_TOKEN } from './constants'

const baseURL = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || 'http://127.0.0.1:8000'

const api = axios.create({
    baseURL
})

api.interceptors.request.use(
    (config)=>{
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error)=>Promise.reject(error)
)

export default api