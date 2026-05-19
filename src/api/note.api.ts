import { isAxiosError } from "axios";
import { Note, NoteFormData, Project, Task } from "../types";
import api from "../lib/axios";

type NoteApiType = {
    formData: NoteFormData,
    projectId: Project['_id'],
    taskId: Task['_id'],
    noteId: Note['_id']
}


export async function createNote({ formData, projectId, taskId } : Pick<NoteApiType, 'formData' | 'projectId' | 'taskId'>) {
    const token = localStorage.getItem('AUTH_TOKEN')
    try {
        const url = `/dashboard/projects/${projectId}/tasks/${taskId}/notes`
        const {data} = await api.post<string>(url, formData, {headers: {Authorization: `Bearer ${token}`}})
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error('Hay un error');   
        }
    }
}

export async function deleteNote({projectId, taskId, noteId} : Pick<NoteApiType,'projectId' | 'taskId' | 'noteId'>) {
    const token = localStorage.getItem('AUTH_TOKEN')
    try {
        const url = `/dashboard/projects/${projectId}/tasks/${taskId}/notes/${noteId}`
        const {data} = await api.delete<string>(url, {headers: {Authorization: `Bearer ${token}`}})
        return data
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error('Hay un error');   
        }
    }
}


