import { isAxiosError } from "axios";
import api from "../lib/axios";
import { Project, TeamMember, TeamMemberFormulario, teamMembersSchema, projectMembersResponseSchema, ProjectMembersResponse } from "../types";

export async function findUserByEmail( { projectId, formData } : {projectId : Project['_id'], formData: TeamMemberFormulario}) {
    const token = localStorage.getItem('AUTH_TOKEN') //obtenemos el token
    try {
        const url = `/dashboard/${projectId}/team/search`
        const {data} = await api.post(url, formData, {headers: {Authorization: `Bearer ${token}`}})
        return data        
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error('Hay un error');   
        }
    }
}

export async function addUserToProject( { projectId, id } : {projectId : Project['_id'], id: TeamMember['_id']}) {
    const token = localStorage.getItem('AUTH_TOKEN') //obtenemos el token
    try {
        const url = `/dashboard/${projectId}/team/`
        const {data} = await api.post<string>(url, {id}, {headers: {Authorization: `Bearer ${token}`}})
        return data        
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error('Hay un error');   
        }
    }
}
export async function getProjectTeamList( projectId: Project['_id']) {
    const token = localStorage.getItem('AUTH_TOKEN') //obtenemos el token
    try {
        const url = `/dashboard/${projectId}/team`
        const {data} = await api(url, {headers: {Authorization: `Bearer ${token}`}})
        const response = teamMembersSchema.safeParse(data);
        if(response.success) return response.data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error('Hay un error');   
        }
    }
}

export async function getProjectMembers(projectId: Project['_id']) {
    const token = localStorage.getItem('AUTH_TOKEN')
    try {
        const url = `/dashboard/${projectId}/members`
        const { data } = await api(url, { headers: { Authorization: `Bearer ${token}` } })
        const response = projectMembersResponseSchema.safeParse(data)
        if (response.success) return response.data as ProjectMembersResponse
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error('Error al obtener miembros del proyecto')
        }
    }
}

export async function deleteUserFromProject({ projectId, userId } : {projectId: Project['_id'], userId: TeamMember['_id']} ) {
    const token = localStorage.getItem('AUTH_TOKEN') //obtenemos el token
    try {
        const url = `/dashboard/${projectId}/team/${userId}`
        const {data} = await api.delete<string>(url, {headers: {Authorization: `Bearer ${token}`}})
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error('Hay un error');   
        }
    }
}