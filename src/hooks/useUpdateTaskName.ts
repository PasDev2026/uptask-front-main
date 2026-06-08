import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateTaskName } from "../api/task.api"

type UseUpdateTaskNameParams = {
    projectId: string
    taskId: string
    name: string
    description: string
}

export const useUpdateTaskName = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ projectId, taskId, name, description }: UseUpdateTaskNameParams) =>
            updateTaskName(projectId, taskId, name, description),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["projectTasks", variables.projectId] })
            queryClient.invalidateQueries({ queryKey: ["subtasks"] })
            queryClient.invalidateQueries({ queryKey: ["projects"] })
            queryClient.invalidateQueries({ queryKey: ["editProject", variables.projectId] })
            queryClient.invalidateQueries({ queryKey: ["fullProjectDetails", variables.projectId] })
        },
    })
}
