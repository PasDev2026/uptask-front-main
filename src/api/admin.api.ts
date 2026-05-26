import { isAxiosError } from "axios";
import api from "../lib/axios";
import { UserAdmin, UpdateUserProfilePayload, UserCreateForm, Role, Area } from "../auth/validation/index";

export async function getAllUsers() {
    const token = localStorage.getItem('AUTH_TOKEN')
    try {
        const { data } = await api<UserAdmin[]>('/auth/users', {
            headers: { Authorization: `Bearer ${token}` }
        })
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error || error.response.data.message);
        }
    }
}

export async function updateUserStatus(userId: string, estado: boolean) {
    const token = localStorage.getItem('AUTH_TOKEN')
    try {
        const { data } = await api.patch<{ message: string; user: { _id: string; estado: boolean } }>(
            `/auth/users/${userId}`,
            { estado },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error || error.response.data.message);
        }
    }
}

export async function updateUserProfileApi(userId: string, data: UpdateUserProfilePayload) {
    const token = localStorage.getItem('AUTH_TOKEN')
    try {
        const { data: responseData } = await api.patch<UserAdmin>(
            `/auth/users/${userId}/update-profile`,
            data,
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return responseData
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error || error.response.data.message);
        }
    }
}

export async function getRoles() {
    const token = localStorage.getItem('AUTH_TOKEN')
    try {
        const { data } = await api<Role[]>('/auth/roles', {
            headers: { Authorization: `Bearer ${token}` }
        })
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error || error.response.data.message);
        }
    }
}

export async function getAreas() {
    const token = localStorage.getItem('AUTH_TOKEN')
    try {
        const { data } = await api<Area[]>('/auth/areas', {
            headers: { Authorization: `Bearer ${token}` }
        })
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error || error.response.data.message);
        }
    }
}

export async function createUserByAdmin(data: UserCreateForm) {
    const token = localStorage.getItem('AUTH_TOKEN')
    try {
        const { data: responseData } = await api.post<string>('/auth/users', data, {
            headers: { Authorization: `Bearer ${token}` }
        })
        return responseData
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error || error.response.data.message);
        }
    }
}

export async function getUserById(userId: string) {
    const token = localStorage.getItem('AUTH_TOKEN')
    try {
        const { data } = await api<UserAdmin>(`/auth/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error || error.response.data.message);
        }
    }
}

export async function resetUserPassword(userId: string, password: string) {
    const token = localStorage.getItem('AUTH_TOKEN')
    try {
        const { data } = await api.patch<{ message: string }>(
            `/auth/users/${userId}/reset-password`,
            { password },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error || error.response.data.message)
        }
        throw new Error('Error de conexión con el servidor')
    }
}
