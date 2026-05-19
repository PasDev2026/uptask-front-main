import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProjectPriority } from "../api/project.api"
import type { TaskPriority } from "../types"

type UseUpdateProjectPriorityParams = {
    projectId: string
    priority: TaskPriority | null
}

export const useUpdateProjectPriority = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ projectId, priority }: UseUpdateProjectPriorityParams) =>
            updateProjectPriority(projectId, priority),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["projects"] })
            queryClient.invalidateQueries({ queryKey: ["editProject", variables.projectId] })
            queryClient.invalidateQueries({ queryKey: ["fullProjectDetails", variables.projectId] })
        },
    })
}
