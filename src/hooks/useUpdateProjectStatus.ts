import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProjectStatus } from "../api/project.api"

type UseUpdateProjectStatusParams = {
    projectId: string
    status: string
}

export const useUpdateProjectStatus = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ projectId, status }: UseUpdateProjectStatusParams) =>
            updateProjectStatus(projectId, status),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["projects"] })
            queryClient.invalidateQueries({ queryKey: ["editProject", variables.projectId] })
            queryClient.invalidateQueries({ queryKey: ["fullProjectDetails", variables.projectId] })
        },
    })
}
