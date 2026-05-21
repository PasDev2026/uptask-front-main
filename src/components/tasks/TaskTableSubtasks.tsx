import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getSubtasks, createTask } from "../../api/task.api"
import { PlusIcon, CheckIcon, XMarkIcon } from "@heroicons/react/20/solid"
import SubtaskRow from "./SubtaskRow"

type TaskTableSubtasksProps = {
  taskId: string
  projectId: string
  canEdit: boolean
  depth?: number
  projectStartDate?: string | null
  projectDueDate?: string | null
}

export default function TaskTableSubtasks({ taskId, projectId, canEdit, depth = 0, projectStartDate, projectDueDate }: TaskTableSubtasksProps) {
  const [showForm, setShowForm] = useState(false)
  const [newTaskName, setNewTaskName] = useState("")
  const queryClient = useQueryClient()

  const { data: children = [], isLoading } = useQuery({
    queryKey: ["subtasks", taskId],
    queryFn: () => getSubtasks(projectId, taskId),
    staleTime: 30000,
  })

  const createSubtask = useMutation({
    mutationFn: async (name: string) => {
      return createTask({
        formData: { name, description: name },
        projectId,
        parentTask: taskId,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subtasks", taskId] })
      queryClient.invalidateQueries({ queryKey: ["projectTasks", projectId] })
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      setNewTaskName("")
      setShowForm(false)
    },
  })

  const padLeft = `${depth * 24}px`

  if (isLoading) {
    return <div className="px-4 py-2 text-xs text-gray-400" style={{ paddingLeft: padLeft }}>Cargando...</div>
  }

  return (
    <div>
      {children.length === 0 && !showForm ? (
        <div className="px-4 py-2 text-xs text-gray-400" style={{ paddingLeft: padLeft }}>
          Sin subtareas
        </div>
      ) : (
        children.map((child) => (
          <SubtaskRow
            key={child._id}
            subtask={child}
            projectId={projectId}
            canEdit={canEdit}
            depth={depth}
            projectStartDate={projectStartDate}
            projectDueDate={projectDueDate}
          />
        ))
      )}

      {canEdit && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1 px-4 py-2 text-xs text-brand-primary hover:text-brand-dark transition-colors"
          style={{ paddingLeft: padLeft }}
        >
          <PlusIcon className="h-3.5 w-3.5" />
          Añadir subtarea
        </button>
      )}

      {canEdit && showForm && (
        <div className="flex items-center gap-2 px-4 py-2" style={{ paddingLeft: padLeft }}>
          <input
            type="text"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            placeholder="Nombre de la subtarea"
            className="flex-1 text-xs border border-slate-300 rounded px-2 py-1.5 focus:outline-none focus:border-brand-primary"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && newTaskName.trim()) {
                createSubtask.mutate(newTaskName.trim())
              }
              if (e.key === "Escape") {
                setShowForm(false)
                setNewTaskName("")
              }
            }}
          />
          <button
            onClick={() => {
              if (newTaskName.trim()) createSubtask.mutate(newTaskName.trim())
            }}
            disabled={!newTaskName.trim() || createSubtask.isPending}
            className="p-1 text-brand-primary hover:text-brand-dark disabled:text-gray-300"
          >
            <CheckIcon className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => {
              setShowForm(false)
              setNewTaskName("")
            }}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}
