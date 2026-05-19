import { DndContext, DragEndEvent } from "@dnd-kit/core";
import TaskCard from "../../components/TaskCard";
import { statusTranslation } from "../../traductor/es";
import { Project, TaskProject, TaskStatus, StatusChangeResponse, ProjectsResponse } from "../../types";
import DropTask from "./DropTask";
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

const statusStyles: { [key: string]: string } = {
  pending: 'border-t-slate-500',
  onHold: 'border-t-red-500',
  inProgress: 'border-t-blue-500',
  underReview: 'border-t-amber-500',
  completed: 'border-t-emerald-500',
};

export default function TaskList({ tasks, canEdit }: TaskListProps) {

  const params = useParams()
  const projectId  = params.projectId!
  const queryClient = useQueryClient()

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

  const handleDragEnd = (e : DragEndEvent) => {
    const {over ,  active} = e
    
    if(over && over.id) {
      const taskId = active.id.toString()
      const status = over.id as TaskStatus
      mutate({projectId,taskId, status})
      
      queryClient.setQueryData(['project', projectId], (prevData: Project) => {
        const updatedTasks = prevData.tasks.map((task) => {
            if(task._id === taskId){
              return  {...task,status} //solo me interersa la tarjeta que estoy cambiando y lo demas mantenerlo
            }
            return task
        })

        return {
          ...prevData,
          tasks: updatedTasks
        }
      })

      

    }
    
  } 
  return (
    <div>
      <h2 className="text-5xl font-black my-10">Tareas</h2>

      <div className="flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32">

        <DndContext onDragEnd={handleDragEnd}>
          {Object.entries(groupedTasks).map(([status, tasks]) => (
            <div key={status} className="min-w-[300px] 2xl:min-w-0 2xl:w-1/5">
              <ul className="mt-5 space-y-5">
                <h3
                  className={`capitalize text-xl font-light border border-slate-300
                      bg-white p-3 border-t-8 ${statusStyles[status]}`}
                >
                  {statusTranslation[status]}
                </h3>

                <DropTask status={status} />

                {tasks.length === 0 ? (
                  <li className="text-gray-500 text-center pt-3">
                    No Hay tareas
                  </li>
                ) : (
                  tasks.map((task) => (
                    <TaskCard key={task._id} task={task} canEdit={canEdit} />
                  ))
                )}
              </ul>
            </div>
          ))}
        </DndContext>

      </div>
    </div>
  );
}
