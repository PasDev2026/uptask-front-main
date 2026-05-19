import { z } from "zod";
import { isAxiosError } from "axios";
import api from "../lib/axios";
import { Project, Task, TaskFormData, taskSchema, StatusChangeResponse, statusChangeResponseSchema, TaskPriority } from "../types";

type TaskAPI = {
    formData: TaskFormData,
    projectId: Project['_id'],
    taskId: Task['_id'],
    status: Task['status']
}


export async function createTask({formData, projectId, parentTask} : Pick<TaskAPI, 'formData' | 'projectId'> & { parentTask?: string }) {
    const token = localStorage.getItem('AUTH_TOKEN')
    try {
        const url = `/dashboard/${projectId}/tasks`
        const payload = parentTask ? { ...formData, parentTask } : formData
        const { data} = await api.post<string>(url, payload, {headers: {Authorization: `Bearer ${token}`}})
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error('desde onError');
          }
    }
}

export async function getTaskById({projectId, taskId}: Pick<TaskAPI, 'projectId' | 'taskId'>) {
    const token = localStorage.getItem('AUTH_TOKEN') //obtenemos el token
    console.log(token);
    try {   
        const url = `/dashboard/${projectId}/tasks/${taskId}`
        const {data} = await api(url, {headers: {Authorization: `Bearer ${token}`}})
        const response = taskSchema.safeParse(data)
        console.log(response);
        if(response.success){
            console.log(response.data);
            
            return response.data
        } 
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error('desde onError');
          }
        console.log(error);
    }
}

export async function updateTaskApi({projectId, taskId, formData}: Pick<TaskAPI, 'projectId' | 'taskId' | 'formData'>) {
    const token = localStorage.getItem('AUTH_TOKEN') //obtenemos el token
    console.log(token);
    try {   
        const url = `/dashboard/${projectId}/tasks/${taskId}`
        const {data} = await api.put<string>(url, formData, {headers: {Authorization: `Bearer ${token}`}})
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error('desde onError');
          }
        console.log(error);
    }
}

export async function updateTaskDates(
    projectId: string,
    taskId: string,
    dates: { startDate?: string | null; dueDate?: string | null }
) {
    const token = localStorage.getItem('AUTH_TOKEN')
    try {
        const url = `/dashboard/${projectId}/tasks/${taskId}/dates`
        const { data } = await api.patch<string>(url, dates, { headers: { Authorization: `Bearer ${token}` } })
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error || 'Error al actualizar fechas')
        }
    }
}

export async function updateTaskPriority(
    projectId: string,
    taskId: string,
    priority: TaskPriority | null
) {
    const token = localStorage.getItem('AUTH_TOKEN')
    try {
        const url = `/dashboard/${projectId}/tasks/${taskId}/priority`
        const { data } = await api.patch<string>(url, { priority }, { headers: { Authorization: `Bearer ${token}` } })
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error || 'Error al actualizar prioridad')
        }
    }
}

export async function deleteTaskApi({projectId, taskId}: Pick<TaskAPI, 'projectId' | 'taskId'>) {
    const token = localStorage.getItem('AUTH_TOKEN') //obtenemos el token
    console.log(token);
    try {   
        const url = `/dashboard/${projectId}/tasks/${taskId}`
        const {data} = await api.delete<string>(url, {headers: {Authorization: `Bearer ${token}`}})
        const response = taskSchema.safeParse(data);
        if(response.success) return response.data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error('desde onError');
          }
        console.log(error);
    }
}

// Subtasks
export async function getSubtasks(projectId: string, taskId: string) {
    const token = localStorage.getItem('AUTH_TOKEN')
    try {
        const url = `/dashboard/${projectId}/tasks/${taskId}/subtasks`
        const { data } = await api(url, { headers: { Authorization: `Bearer ${token}` } })
        const response = z.array(taskSchema).safeParse(data)
        if (response.success) return response.data
        return []
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error('Error al obtener subtareas')
        }
    }
}

export async function getTaskTree(projectId: string, taskId: string) {
    const token = localStorage.getItem('AUTH_TOKEN')
    try {
        const url = `/dashboard/${projectId}/tasks/${taskId}/tree`
        const { data } = await api(url, { headers: { Authorization: `Bearer ${token}` } })
        const response = z.array(taskSchema).safeParse(data)
        if (response.success) return response.data
        return []
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error('Error al obtener árbol de tareas')
        }
    }
}

export async function moveTask(projectId: string, taskId: string, newParentTask: string) {
    const token = localStorage.getItem('AUTH_TOKEN')
    try {
        const url = `/dashboard/${projectId}/tasks/${taskId}/move`
        const { data } = await api.put(url, { newParentTask }, { headers: { Authorization: `Bearer ${token}` } })
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error('Error al mover tarea')
        }
    }
}

export async function reorderTasks(projectId: string, tasks: { id: string, order: number }[]) {
    const token = localStorage.getItem('AUTH_TOKEN')
    try {
        const url = `/dashboard/${projectId}/tasks-order`
        const { data } = await api.put(url, { tasks }, { headers: { Authorization: `Bearer ${token}` } })
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error('Error al reordenar tareas')
        }
    }
}

//Api para el estado
export async function updateStatusTask({projectId, taskId, status}: Pick<TaskAPI, 'projectId' | 'taskId' | 'status'>) {
    const token = localStorage.getItem('AUTH_TOKEN') //obtenemos el token
    try {   
        const url = `/dashboard/${projectId}/tasks/${taskId}/status/`
        const {data} = await api.post(url, {status}, {headers: {Authorization: `Bearer ${token}`}})
        const response = statusChangeResponseSchema.safeParse(data)
        if(response.success) return response.data as StatusChangeResponse
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error('Error al cambiar estado');
          }
        console.log(error);
    }
}

export async function assignTask(projectId: string, taskId: string, userIds: string[]) {
    const token = localStorage.getItem('AUTH_TOKEN')
    try {
        const url = `/dashboard/${projectId}/tasks/${taskId}/assign`
        const { data } = await api.patch(url, { userIds }, { headers: { Authorization: `Bearer ${token}` } })
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error('Error al asignar responsables')
        }
        console.log(error)
    }
}