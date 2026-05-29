import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProjectResponsible } from "../api/project.api"

type UseUpdateProjectResponsibleParams = {
    projectId: string
    userIds: string[]
}

export const useUpdateProjectResponsible = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ projectId, userIds }: UseUpdateProjectResponsibleParams) =>
            updateProjectResponsible(projectId, userIds),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["projects"] })
            queryClient.invalidateQueries({ queryKey: ["editProject", variables.projectId] })
            queryClient.invalidateQueries({ queryKey: ["projectSedeUsers", variables.projectId] })
        },
    })
}
