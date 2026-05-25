import { isAxiosError } from "axios";
import { UpdateCurrentUserPasswordForm, UserProfileForm } from "../auth/validation";
import api from "../lib/axios";


export async function updateProfile(formData:UserProfileForm) {
    const token = localStorage.getItem('AUTH_TOKEN') //obtenemos el token
    console.log(token);
    try {
        const {data} = await api.put<{message: string}>('/auth/profile', formData, {headers: {Authorization: `Bearer ${token}`}})
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.message)
        }
        throw new Error('Error de conexion con el servidor')
    }
}

export async function changePasswordPorfile(formData:UpdateCurrentUserPasswordForm) {
    const token = localStorage.getItem('AUTH_TOKEN') //obtenemos el token
    console.log(token);
    try {
        const {data} = await api.post<{message: string}>('/auth/profile/update-password', formData, {headers: {Authorization: `Bearer ${token}`}})
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.message)
        }
        throw new Error('Error de conexion con el servidor')
    }
}