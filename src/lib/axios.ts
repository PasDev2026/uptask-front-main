import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})
/* Dato */
//esta es una opcion para evitar colocar el auth token en cada api prject.api.ts	
//pero genera problemas con el refresh token y el logout, por eso se usa el interceptor de axios
/*api.interceptors.request.use(config => {
    const token = localStorage.getItem('AUTH_TOKEN')
    if(token) config.headers.Authorization = `Bearer ${token}`
    return config
}) */

export default api