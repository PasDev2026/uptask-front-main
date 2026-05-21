import { isAxiosError } from "axios";
import api from "../lib/axios";
import { dashboardProjectsSchema, editProjectSchema, fullProjectDetailsSchema, Project, ProjectFormData, taskPreviewResponseSchema, ProjectsResponse } from "../types";
//dato este archivo trabaja con el archivo de los types index.js
export async function createProject(formData:ProjectFormData) {
    const token = localStorage.getItem('AUTH_TOKEN') //obtenemos el token
    console.log(token);
    try {
        const {data} = await api.post('/dashboard/projects', formData, {headers: {Authorization: `Bearer ${token}`}}); 
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.message ?? 'Error al crear proyecto');
          }
    }
}

export async function getProjects(filters?: { search?: string; dateFrom?: string; dateTo?: string; offset?: number; limit?: number }){
    const token = localStorage.getItem('AUTH_TOKEN')
    try {
        const params: Record<string, string> = {}
        if (filters?.search) params.search = filters.search
        if (filters?.dateFrom) params.dateFrom = filters.dateFrom
        if (filters?.dateTo) params.dateTo = filters.dateTo
        if (filters?.offset !== undefined) params.offset = String(filters.offset)
        if (filters?.limit !== undefined) params.limit = String(filters.limit)
        const { data } = await api('/dashboard/projects', {
            headers: { Authorization: `Bearer ${token}` },
            params,
        })

        const response = dashboardProjectsSchema.safeParse(data);
        if(response.success) return response.data as ProjectsResponse
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error('Error al cargar proyectos');
        }
    }
}

export async function getProjectsById(id: Project['_id']){
    const token = localStorage.getItem('AUTH_TOKEN') //obtenemos el token
    try {
        const { data } = await api(`/dashboard/projects/${id}`, {headers: {Authorization: `Bearer ${token}`}})
        const response = editProjectSchema.safeParse(data)
        if(response.success){
            return response.data
        }
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error('desde onError');
        }
    }
}

export async function getFullProjectDetails(id: Project['_id']){
    const token = localStorage.getItem('AUTH_TOKEN') //obtenemos el token
    try {
        const { data } = await api(`/dashboard/projects/${id}`, {headers: {Authorization: `Bearer ${token}`}})
        // El backend ahora devuelve campos adicionales (dueDate, isOverdue, progress)
        const response = fullProjectDetailsSchema.safeParse(data)
        if(response.success){
            return response.data
        }
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error('desde onError');
        }
    }
}

type  ProjectApiType = {
    formData: ProjectFormData,
    projectId: Project['_id']
}
export async function updateProject({formData, projectId}: ProjectApiType){
    const token = localStorage.getItem('AUTH_TOKEN') //obtenemos el token
    console.log(token);
    try {
        const { data } = await api.put<string>(`/dashboard/projects/${projectId}`, formData, {headers: {Authorization: `Bearer ${token}`}})
        return data        
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error('desde onError');
        }
    }
}


export async function deleteProject(id: Project['_id']){
    const token = localStorage.getItem('AUTH_TOKEN') //obtenemos el token
    console.log(token);
    try {
        const { data } = await api.delete<string>(`/dashboard/projects/${id}`, {headers: {Authorization: `Bearer ${token}`}})
        return data        
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error('Ocurrió un error: ');
        }
    }
}

export async function getProjectTasksPreview(projectId: Project['_id']) {
    const token = localStorage.getItem('AUTH_TOKEN')
    try {
        const { data } = await api(`/dashboard/projects/${projectId}/tasks-preview`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        const response = taskPreviewResponseSchema.safeParse(data)
        if (response.success) return response.data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error('Error al cargar tareas')
        }
    }
}

export async function updateProjectDates(
    projectId: Project['_id'],
    dates: { startDate?: string | null; dueDate?: string | null }
) {
    const token = localStorage.getItem('AUTH_TOKEN')
    try {
        const { data } = await api.patch(
            `/dashboard/projects/${projectId}/dates`,
            dates,
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error('Error al actualizar fechas del proyecto')
        }
    }
}

export async function updateProjectStatus(
    projectId: Project['_id'],
    status: string
) {
    const token = localStorage.getItem('AUTH_TOKEN')
    try {
        const { data } = await api.patch(
            `/dashboard/projects/${projectId}/status`,
            { status },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error('Error al actualizar estado del proyecto')
        }
    }
}

export async function updateProjectPriority(
    projectId: Project['_id'],
    priority: string | null
) {
    const token = localStorage.getItem('AUTH_TOKEN')
    try {
        const { data } = await api.patch(
            `/dashboard/projects/${projectId}/priority`,
            { priority },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error('Error al actualizar prioridad del proyecto')
        }
    }
}

export async function updateProjectResponsible(
    projectId: Project['_id'],
    userIds: string[]
) {
    const token = localStorage.getItem('AUTH_TOKEN')
    try {
        const { data } = await api.patch(
            `/dashboard/projects/${projectId}/responsible`,
            { userIds },
            { headers: { Authorization: `Bearer ${token}` } }
        )
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error('Error al actualizar responsables del proyecto')
        }
    }
}
