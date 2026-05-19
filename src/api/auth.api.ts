import { isAxiosError } from "axios";
import api from "../lib/axios";
import { CheckPasswordForm, ConfirmToken, ForgotPasswordForm, NewPasswordForm, RequestConfirmationCodeForm, User, UserLoginForm, UserRegistrationForm } from "../auth/validation/index";

export async function createAccount(formData:UserRegistrationForm) {
    try {
        const url = '/auth/register'
        const data = await api.post<string>(url, formData)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.message);
        }
    }
}

export async function confirmAccount(formData:ConfirmToken) {
    try {
        const url = '/auth/confirmation-account'
        const {data} = await api.post<string>(url, formData)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.message);
        }
    }
}

export async function requestConfirmationCodeForm(formData:RequestConfirmationCodeForm) {
    try {
        const url = '/auth/reset-token'
        const {data} = await api.post<string>(url, formData)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.message);
        }
    }
}

//Login - JWT -COOKIE
export async function authenticate(formData:UserLoginForm) {
    try {
        const url = '/auth/login'
        const {data} = await api.post<string>(url, formData)
        localStorage.setItem('AUTH_TOKEN', data)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.message);
        }
    }
}

export async function changePassword(formData:ForgotPasswordForm) {
    try {
        const url = '/auth/change-password'
        const {data} = await api.post<string>(url, formData)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.message);
        }
    }
}

export async function validateToken(formData:ConfirmToken) {
    try {
        const url = '/auth/validate-token'
        const {data} = await api.post<string>(url, formData)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.message);
        }
    }
}


export async function updatePasswordWithToken({formData, token}:{formData: NewPasswordForm, token: ConfirmToken['token']}) {
 
    try {
        const url = `/auth/change-password/${token}`
        const {data} = await api.post<string>(url, formData)
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.message);
        }
    }
}

export async function getUserApi() {
    const token = localStorage.getItem('AUTH_TOKEN') //obtenemos el token
    try {
        const { data } = await api<User>('/auth/perfil/user', {headers: {Authorization: `Bearer ${token}`}})
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.message);
        }
    }
}



export async function checkPasswordApi(formData:CheckPasswordForm) { //revia si el password es correcto
    const token = localStorage.getItem('AUTH_TOKEN') //obtenemos el token
    try {
        const url = `/auth/check-password`
        const { data } = await api.post<string>(url, formData,{headers: {Authorization: `Bearer ${token}`}})
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.message);
        }
    }
}