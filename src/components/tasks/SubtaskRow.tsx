import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getSubtasks, createTask } from "../../api/task.api"
import { Task } from "../../types"
import TaskStatusPopover from "../TaskStatusPopover"
import ResponsiblePopover from "../ResponsiblePopover"
import PriorityPopover from "../PriorityPopover"
import { useUpdateTaskPriority } from "../../hooks/useUpdateTaskPriority"
import { useUpdateTaskStatus } from "../../hooks/useUpdateTaskStatus"
import { useUpdateTaskAssignee } from "../../hooks/useUpdateTaskAssignee"
import { useDeleteTask } from "../../hooks/useDeleteTask"
import TaskDateCellPopover from "../TaskDateCellPopover"
import { TABLE_GRID } from "../../constants/tableColumns"
import { ChevronRightIcon, ChevronDownIcon, PlusIcon, CheckIcon, XMarkIcon, TrashIcon } from "@heroicons/react/20/solid"
import Swal from "sweetalert2"

type SubtaskRowProps = {
  subtask: Task
  projectId: string
  canEdit: boolean
  depth: number
  projectStartDate?: string | null
  projectDueDate?: string | null
}

export default function SubtaskRow({ subtask, projectId, canEdit, depth, projectStartDate, projectDueDate }: SubtaskRowProps) {
  const [expanded, setExpanded] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [newTaskName, setNewTaskName] = useState("")
  const queryClient = useQueryClient()
  const updateTaskPriority = useUpdateTaskPriority()
  const updateTaskStatus = useUpdateTaskStatus()
  const updateTaskAssignee = useUpdateTaskAssignee()
  const deleteTask = useDeleteTask()

  const handleDeleteSubtask = (taskId: string, parentTaskId: string | null) => {
    Swal.fire({
      title: "¿Eliminar subtarea?",
      text: "Esta acción eliminará la subtarea y todas sus subtareas hijas",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTask.mutate({ projectId, taskId, parentTaskId })
      }
    })
  }

  const { data: children = [], isLoading } = useQuery({
    queryKey: ["subtasks", subtask._id],
    queryFn: () => getSubtasks(projectId, subtask._id),
    enabled: expanded,
    staleTime: 30000,
  })

  const createSubtask = useMutation({
    mutationFn: async (name: string) => {
      return createTask({
        formData: { name, description: name },
        projectId,
        parentTask: subtask._id,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subtasks", subtask._id] })
      queryClient.invalidateQueries({ queryKey: ["projectTasks", projectId] })
      setNewTaskName("")
      setShowForm(false)
    },
  })

  const rowPad = `${depth * 24}px`
  const childPad = `${(depth + 1) * 24}px`

  return (
    <div>
      <div
        className="grid items-center px-4 py-2 hover:bg-slate-50 transition-colors border-b border-slate-50 divide-x divide-slate-100"
        style={{ gridTemplateColumns: TABLE_GRID }}
      >
        <div
          className="flex items-center gap-2 min-w-0"
          style={{ gridColumn: '1 / span 2', paddingLeft: rowPad }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded) }}
            className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-200 transition-colors flex-shrink-0"
          >
            {isLoading ? (
              <span className="h-3.5 w-3.5 block animate-pulse bg-gray-200 rounded" />
            ) : expanded ? (
              <ChevronDownIcon className="h-3.5 w-3.5 text-gray-400" />
            ) : (
              <ChevronRightIcon className="h-3.5 w-3.5 text-gray-400" />
            )}
          </button>
          <span className="text-sm text-slate-700 truncate">
            {subtask.name}
          </span>
        </div>

        <div className="flex items-center">
          <TaskStatusPopover
            status={subtask.status}
            onSelect={(s) => updateTaskStatus.mutate({ projectId, taskId: subtask._id, status: s })}
          />
        </div>

        <div className="flex items-center">
          <ResponsiblePopover
            projectId={projectId}
            assignedTo={subtask.assignedTo ?? []}
            onAssign={(userIds) => updateTaskAssignee.mutate({ projectId, taskId: subtask._id, userIds })}
          />
        </div>

        <div className="flex items-center">
          <PriorityPopover
            priority={subtask.priority}
            onSelect={(p) => updateTaskPriority.mutate({ projectId, taskId: subtask._id, priority: p })}
          />
        </div>

        <div className="flex items-center">
          <TaskDateCellPopover
            projectId={projectId}
            taskId={subtask._id}
            startDate={subtask.startDate}
            dueDate={subtask.dueDate}
            projectStartDate={projectStartDate}
            projectDueDate={projectDueDate}
          />
        </div>

        <div />

        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleDeleteSubtask(subtask._id, subtask.parentTask)
            }}
            className="p-1 text-red-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
            title="Eliminar subtarea"
          >
            <TrashIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {expanded && (
        <div>
          {children.length === 0 && !showForm && (
            <div className="px-4 py-2 text-xs text-gray-400" style={{ paddingLeft: childPad }}>
              Sin subtareas
            </div>
          )}

          {children.map((child: Task) => (
            <SubtaskRow
              key={child._id}
              subtask={child}
              projectId={projectId}
              canEdit={canEdit}
              depth={depth + 1}
              projectStartDate={projectStartDate}
              projectDueDate={projectDueDate}
            />
          ))}

          {canEdit && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1 px-4 py-2 text-xs text-brand-primary hover:text-brand-dark transition-colors"
              style={{ paddingLeft: childPad }}
            >
              <PlusIcon className="h-3.5 w-3.5" />
              Añadir subtarea
            </button>
          )}

          {canEdit && showForm && (
            <div className="flex items-center gap-2 px-4 py-2" style={{ paddingLeft: childPad }}>
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
      )}
    </div>
  )
}
