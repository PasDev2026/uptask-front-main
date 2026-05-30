import { useDroppable } from "@dnd-kit/core"
import { statusTranslation, statusColors } from "../../traductor/es"
import { TaskProject } from "../../types"
import TaskCard from "../../components/TaskCard"

type TaskColumnProps = {
  status: string
  tasks: TaskProject[]
  canEdit: boolean
}

export default function TaskColumn({ status, tasks, canEdit }: TaskColumnProps) {
  const { isOver, setNodeRef } = useDroppable({ id: status })
  const colors = statusColors[status]

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 rounded-lg transition-all ${colors.columnBg} ${isOver ? "ring-2 ring-blue-400/30" : ""}`}
    >
      <div className="flex items-center gap-2 px-3 py-3">
        <span className={`h-2.5 w-2.5 rounded-full ${colors.dot}`} />
        <h3 className="font-semibold text-sm text-slate-700 uppercase tracking-wide">
          {statusTranslation[status]}
        </h3>
        <span className="ml-auto text-xs text-slate-400">{tasks.length}</span>
      </div>

      <div className="space-y-3 px-1 pb-3">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} canEdit={canEdit} />
        ))}
      </div>
    </div>
  )
}
