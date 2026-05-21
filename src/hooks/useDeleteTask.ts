import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteTaskApi } from "../api/task.api"
import Swal from "sweetalert2"

type UseDeleteTaskParams = {
    projectId: string
    taskId: string
    parentTaskId?: string | null
}

export const useDeleteTask = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ projectId, taskId }: UseDeleteTaskParams) =>
            deleteTaskApi({ projectId, taskId }),
        onSuccess: (_data, variables) => {
            Swal.fire("Eliminado", "Tarea eliminada correctamente", "success")
            queryClient.invalidateQueries({ queryKey: ["projectTasks", variables.projectId] })
            queryClient.invalidateQueries({ queryKey: ["projects"] })
            if (variables.parentTaskId) {
                queryClient.invalidateQueries({ queryKey: ["subtasks", variables.parentTaskId] })
            }
        },
        onError: (error) => {
            Swal.fire({
                icon: "error",
                title: error.message,
                text: "Ocurrió un error, verifique los datos!",
            })
        },
    })
}
