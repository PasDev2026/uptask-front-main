import { useState } from "react"
import { Link } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getProjectTasks } from "../../api/project.api"
import { createTask } from "../../api/task.api"
import { TaskPreviewResponse } from "../../types"
import TaskTableSubtasks from "./TaskTableSubtasks"
import TaskStatusPopover from "../TaskStatusPopover"
import ResponsiblePopover from "../ResponsiblePopover"
import PriorityPopover from "../PriorityPopover"
import { useUpdateTaskPriority } from "../../hooks/useUpdateTaskPriority"
import { useUpdateTaskStatus } from "../../hooks/useUpdateTaskStatus"
import { useUpdateTaskAssignee } from "../../hooks/useUpdateTaskAssignee"
import { useDeleteTask } from "../../hooks/useDeleteTask"
import TaskDateCellPopover from "../TaskDateCellPopover"
import { TABLE_GRID } from "../../constants/tableColumns"
import { ChevronDownIcon, ChevronRightIcon, PlusIcon, CheckIcon, XMarkIcon, TrashIcon } from "@heroicons/react/20/solid"
import Swal from "sweetalert2"

type TaskTableSectionProps = {
  projectId: string
  canEdit: boolean
  depth?: number
  projectStartDate?: string | null
  projectDueDate?: string | null
}

export default function TaskTableSection({ projectId, canEdit, depth = 1, projectStartDate, projectDueDate }: TaskTableSectionProps) {
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set())
  const [showForm, setShowForm] = useState(false)
  const [newTaskName, setNewTaskName] = useState("")
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery<TaskPreviewResponse>({
    queryKey: ["projectTasks", projectId],
    queryFn: async () => {
      const result = await getProjectTasks(projectId)
      if (!result) throw new Error("No data")
      return result
    },
  })

  const createRootTask = useMutation({
    mutationFn: async (name: string) => {
      return createTask({
        formData: { name },
        projectId,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectTasks", projectId] })
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      setNewTaskName("")
      setShowForm(false)
    },
  })

  const updateTaskPriority = useUpdateTaskPriority()
  const updateTaskStatus = useUpdateTaskStatus()
  const updateTaskAssignee = useUpdateTaskAssignee()
  const deleteTask = useDeleteTask()

  const handleDeleteTask = (taskId: string) => {
    Swal.fire({
      title: "¿Eliminar tarea?",
      text: "Esta acción eliminará la tarea y todas sus subtareas",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTask.mutate({ projectId, taskId })
      }
    })
  }

  const toggleExpand = (taskId: string) => {
    setExpandedTasks((prev) => {
      const next = new Set(prev)
      if (next.has(taskId)) next.delete(taskId)
      else next.add(taskId)
      return next
    })
  }

  if (isLoading) {
    return (
      <div className="px-4 py-4 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-slate-300 border-t-brand-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="px-4 py-3">
        <p className="text-xs text-gray-400">Error al cargar las tareas</p>
      </div>
    )
  }

  const rootTasks = data.tasks.filter((t) => !t.parentTask)
  const displayLimit = 10
  const visibleTasks = rootTasks.slice(0, displayLimit)

  if (rootTasks.length === 0) {
    return (
      <div className="border-t border-slate-100">
        <div className="px-4 py-3">
          {canEdit && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1 text-xs text-brand-primary hover:text-brand-dark transition-colors"
            >
              <PlusIcon className="h-3.5 w-3.5" />
              Añadir tarea
            </button>
          )}
        </div>
        {canEdit && showForm && (
          <div className="flex items-center gap-2 px-4 py-2 border-t border-slate-100">
            <input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="Nombre de la tarea"
              className="flex-1 text-xs border border-slate-300 rounded px-2 py-1.5 focus:outline-none focus:border-brand-primary"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && newTaskName.trim()) {
                  createRootTask.mutate(newTaskName.trim())
                }
                if (e.key === "Escape") {
                  setShowForm(false)
                  setNewTaskName("")
                }
              }}
            />
            <button
              onClick={() => {
                if (newTaskName.trim()) createRootTask.mutate(newTaskName.trim())
              }}
              disabled={!newTaskName.trim() || createRootTask.isPending}
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

  return (
    <div className="border-t border-slate-100">
      {visibleTasks.map((task) => (
        <div key={task._id} className="border-b border-slate-50 last:border-b-0">
          <div
            //SIN cursor-pointer
            className="grid items-center px-4 py-2.5 hover:bg-slate-50 transition-colors divide-x divide-slate-100 group"
            style={{ gridTemplateColumns: TABLE_GRID }}
            //onClick={() => navigate(`/projects/${projectId}/details-projects?viewTask=${task._id}`)}
          >
            <div
              className="flex items-center gap-2 min-w-0"
              style={{ gridColumn: '1 / span 2', paddingLeft: `${depth * 24}px` }}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleExpand(task._id)
                }}
                className={`p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-200 transition-all flex-shrink-0 ${
                  task.subtaskCount > 0
                    ? 'opacity-100'
                    : expandedTasks.has(task._id)
                      ? 'opacity-100'
                      : 'opacity-0 group-hover:opacity-100'
                }`}
              >
                {expandedTasks.has(task._id) ? (
                  <ChevronDownIcon className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRightIcon className="h-3.5 w-3.5" />
                )}
              </button>
              <Link
                to={`/projects/${projectId}/details-projects?viewTask=${task._id}`}
                className="text-sm font-medium text-slate-800 truncate hover:text-brand-primary hover:underline"
              >
                {task.name}
              </Link>
            </div>
            <div>
              {/* column de empresa o sede, por ahora vacia */}
            </div>

            <div className="flex items-center">
              <TaskStatusPopover
                status={task.status}
                onSelect={(s) => updateTaskStatus.mutate({ projectId, taskId: task._id, status: s })}
              />
            </div>

            <div className="flex items-center">
              <ResponsiblePopover
                projectId={projectId}
                assignedTo={task.assignedTo ?? []}
                onAssign={(userIds) => updateTaskAssignee.mutate({ projectId, taskId: task._id, userIds })}
              />
            </div>

            <div className="flex items-center">
              <PriorityPopover
                priority={task.priority}
                onSelect={(p) => updateTaskPriority.mutate({ projectId, taskId: task._id, priority: p })}
              />
            </div>

            <div className="flex items-center">
              <TaskDateCellPopover
                projectId={projectId}
                taskId={task._id}
                startDate={task.startDate}
                dueDate={task.dueDate}
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
                  handleDeleteTask(task._id)
                }}
                className="p-1 text-red-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                title="Eliminar tarea"
              >
                <TrashIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {expandedTasks.has(task._id) && (
            <TaskTableSubtasks
              taskId={task._id}
              projectId={projectId}
              canEdit={canEdit}
              depth={depth + 1}
              projectStartDate={projectStartDate}
              projectDueDate={projectDueDate}
            />
          )}
        </div>
      ))}

      {rootTasks.length > displayLimit && (
        <div className="px-4 py-3 text-center border-t border-slate-100">
          <Link
            to={`/projects/${projectId}/details-projects`}
            className="text-xs text-brand-primary hover:text-brand-dark hover:underline"
          >
            Mostrando {visibleTasks.length} de {rootTasks.length} tareas. Ver todas &rarr;
          </Link>
        </div>
      )}

      {canEdit && !showForm && (
        <div className="border-t border-slate-100">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1 px-4 py-2 text-xs text-brand-primary hover:text-brand-dark transition-colors"
          >
            <PlusIcon className="h-3.5 w-3.5" />
            Añadir tarea
          </button>
        </div>
      )}

      {canEdit && showForm && (
        <div className="flex items-center gap-2 px-4 py-2 border-t border-slate-100">
          <input
            type="text"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            placeholder="Nombre de la tarea"
            className="flex-1 text-xs border border-slate-300 rounded px-2 py-1.5 focus:outline-none focus:border-brand-primary"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && newTaskName.trim()) {
                createRootTask.mutate(newTaskName.trim())
              }
              if (e.key === "Escape") {
                setShowForm(false)
                setNewTaskName("")
              }
            }}
          />
          <button
            onClick={() => {
              if (newTaskName.trim()) createRootTask.mutate(newTaskName.trim())
            }}
            disabled={!newTaskName.trim() || createRootTask.isPending}
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
