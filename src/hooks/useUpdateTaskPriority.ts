import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateTaskPriority } from "../api/task.api"
import type { TaskPreviewResponse, TaskPriority } from "../types"

type UseUpdateTaskPriorityParams = {
    projectId: string
    taskId: string
    priority: TaskPriority | null
}

export const useUpdateTaskPriority = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ projectId, taskId, priority }: UseUpdateTaskPriorityParams) =>
            updateTaskPriority(projectId, taskId, priority),
        onSuccess: (_data, variables) => {
            queryClient.setQueryData<TaskPreviewResponse>(
                ["projectTasks", variables.projectId],
                (old) => {
                    if (!old) return old
                    return {
                        ...old,
                        tasks: old.tasks.map((task) =>
                            task._id === variables.taskId
                                ? { ...task, priority: variables.priority }
                                : task
                        ),
                    }
                }
            )
            queryClient.invalidateQueries({ queryKey: ["editProject", variables.projectId] })
            queryClient.invalidateQueries({ queryKey: ["subtasks"] })
        },
    })
}
