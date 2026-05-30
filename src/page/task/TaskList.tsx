import { useState } from "react";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { TaskProject, TaskStatus, StatusChangeResponse, ProjectsResponse } from "../../types";
import TaskColumn from "../../components/tasks/TaskColumn";
import { statusColors } from "../../traductor/es";
import { updateStatusTask } from "../../api/task.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";


type TaskListProps = {
  tasks: TaskProject[]
  canEdit: boolean
};

type GroupedTask = {
  [key: string]: TaskProject[];
};

const initialStatusGroup: GroupedTask = {
  pending: [],
  onHold: [],
  inProgress: [],
  underReview: [],
  completed: [],
};

export default function TaskList({ tasks, canEdit }: TaskListProps) {

  const params = useParams()
  const projectId  = params.projectId!
  const queryClient = useQueryClient()
  const [activeTask, setActiveTask] = useState<TaskProject | null>(null)
  const [activeOverStatus, setActiveOverStatus] = useState<TaskStatus | null>(null)

  //Aqui se maneja el esatdo de las tareas
  const { mutate } = useMutation<StatusChangeResponse, Error, { projectId: string; taskId: string; status: TaskStatus }>({
    mutationFn: async (vars) => {
      const result = await updateStatusTask(vars)
      if (!result) throw new Error("No data")
      return result
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: error.message,
        text: "Algo salió mal. Por favor, inténtalo de nuevo.",
        confirmButtonText: "Entendido",
      });
    },
    onSuccess: (data: StatusChangeResponse) => {
      Swal.fire({
        icon: "success",
        title: data.message,
        text: `Progreso: ${data.progress.percentage}%`,
        confirmButtonText: "¡Okey!",
      });
      
      // Actualizar el progreso en el cache de proyectos
      queryClient.setQueryData(["projects"], (oldData: ProjectsResponse | undefined) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          projects: oldData.projects.map((p) => 
            p._id === projectId ? { ...p, progress: data.progress } : p
          )
        }
      })

      queryClient.invalidateQueries({ queryKey: ["editProject", projectId] })
      queryClient.invalidateQueries({ queryKey: ["projectTasks", projectId] })
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    }
  });
  
  
    const rootTasks = tasks.filter(task => !task.parentTask)
    const groupedTasks = rootTasks.reduce((acc, task) => {
    let currentGroup = acc[task.status] ? [...acc[task.status]] : [];
    currentGroup = [...currentGroup, task];
    return { ...acc, [task.status]: currentGroup };
  }, initialStatusGroup);
/* 
  console.log(groupedTasks); */

  const handleDragStart = (e: DragStartEvent) => {
    const taskId = e.active.id.toString()
    const task = tasks.find(t => t._id === taskId)
    if (task) setActiveTask(task)
  }

  const handleDragOver = (e: DragOverEvent) => {
    const overId = e.over?.id?.toString()
    if (overId && ["pending", "onHold", "inProgress", "underReview", "completed"].includes(overId)) {
      setActiveOverStatus(overId as TaskStatus)
    }
  }

  const handleDragEnd = (e : DragEndEvent) => {
    setActiveTask(null)
    setActiveOverStatus(null)
    const {over ,  active} = e
    
    if(over && over.id) {
      const taskId = active.id.toString()
      const status = over.id as TaskStatus
      mutate({projectId,taskId, status})
    }
    
  }

  const overlayBorderClass = activeOverStatus
    ? (statusColors[activeOverStatus]?.overlayBorder ?? "border-l-transparent")
    : "border-l-transparent"

  return (
    <div>
      <h2 className="text-5xl font-black my-10">Tareas</h2>

      <div className="flex gap-4 pb-32">

        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
          {Object.entries(groupedTasks).map(([status, tasks]) => (
            <TaskColumn key={status} status={status} tasks={tasks} canEdit={canEdit} />
          ))}
          <DragOverlay>
            {activeTask ? (
              <div className={`p-4 bg-white rounded-lg shadow-lg w-[300px] border-l-4 ${overlayBorderClass}`}>
                <p className="font-bold text-slate-900">{activeTask.name}</p>
                <p className="text-slate-500 text-sm mt-1">{activeTask.description}</p>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

      </div>
    </div>
  );
}
