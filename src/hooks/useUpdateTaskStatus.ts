import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateStatusTask } from "../api/task.api"
import type { TaskPreviewResponse, TaskStatus, ProjectsResponse, StatusChangeResponse } from "../types"

type UseUpdateTaskStatusParams = {
    projectId: string
    taskId: string
    status: TaskStatus
}

export const useUpdateTaskStatus = () => {
    const queryClient = useQueryClient()

    return useMutation<StatusChangeResponse | undefined, Error, UseUpdateTaskStatusParams>({
        mutationFn: ({ projectId, taskId, status }: UseUpdateTaskStatusParams) =>
            updateStatusTask({ projectId, taskId, status }),
        onSuccess: (data, variables) => {
            queryClient.setQueryData<TaskPreviewResponse>(
                ["projectTasks", variables.projectId],
                (old) => {
                    if (!old) return old
                    return {
                        ...old,
                        tasks: old.tasks.map((task) =>
                            task._id === variables.taskId
                                ? { ...task, status: variables.status }
                                : task
                        ),
                    }
                }
            )

            if (data?.progress) {
                queryClient.setQueryData<ProjectsResponse>(["projects"], (oldData) => {
                    if (!oldData) return oldData
                    return {
                        ...oldData,
                        projects: oldData.projects.map((p) =>
                            p._id === variables.projectId
                                ? { ...p, progress: data.progress }
                                : p
                        ),
                    }
                })
            }

            queryClient.invalidateQueries({ queryKey: ["editProject", variables.projectId] })
            queryClient.invalidateQueries({ queryKey: ["subtasks"] })
        },
    })
}
