import { useMutation, useQueryClient } from "@tanstack/react-query"
import { assignTask } from "../api/task.api"

type UseUpdateTaskAssigneeParams = {
    projectId: string
    taskId: string
    userIds: string[]
}

export const useUpdateTaskAssignee = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ projectId, taskId, userIds }: UseUpdateTaskAssigneeParams) =>
            assignTask(projectId, taskId, userIds),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["projectTasks", variables.projectId] })
            queryClient.invalidateQueries({ queryKey: ["subtasks"] })
            queryClient.invalidateQueries({ queryKey: ["projectSedeUsers", variables.projectId] })
        },
    })
}
