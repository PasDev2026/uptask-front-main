import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProjectName } from "../api/project.api"
import { Project } from "../types"

type UseUpdateProjectNameParams = {
    projectId: Project['_id']
    projectName: string
    description: string
}

export const useUpdateProjectName = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ projectId, projectName, description }: UseUpdateProjectNameParams) =>
            updateProjectName(projectId, projectName, description),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["projects"] })
            queryClient.invalidateQueries({ queryKey: ["editProject", variables.projectId] })
            queryClient.invalidateQueries({ queryKey: ["fullProjectDetails", variables.projectId] })
        },
    })
}
