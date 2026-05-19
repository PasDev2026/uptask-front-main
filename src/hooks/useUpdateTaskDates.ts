import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateTaskDates } from "../api/task.api"
import type { TaskPreviewResponse } from "../types"

type UseUpdateTaskDatesParams = {
    projectId: string
    taskId: string
    dates: { startDate?: string | null; dueDate?: string | null }
}

export const useUpdateTaskDates = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ projectId, taskId, dates }: UseUpdateTaskDatesParams) =>
            updateTaskDates(projectId, taskId, dates),
        onSuccess: (_data, variables) => {
            queryClient.setQueryData<TaskPreviewResponse>(
                ["projectTasks", variables.projectId],
                (old) => {
                    if (!old) return old
                    return {
                        ...old,
                        tasks: old.tasks.map((task) =>
                            task._id === variables.taskId
                                ? { ...task, startDate: variables.dates.startDate, dueDate: variables.dates.dueDate }
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
