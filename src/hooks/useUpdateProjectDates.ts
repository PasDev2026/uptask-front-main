import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProjectDates } from "../api/project.api"

type UseUpdateProjectDatesParams = {
    projectId: string
    dates: { startDate?: string | null; dueDate?: string | null }
}

export const useUpdateProjectDates = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ projectId, dates }: UseUpdateProjectDatesParams) =>
            updateProjectDates(projectId, dates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] })
        },
    })
}
