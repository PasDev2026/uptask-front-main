import { Menu, Transition } from "@headlessui/react";
import { TaskProject } from "../types";
import { Fragment, useRef, useState } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTaskApi } from "../api/task.api";
import Swal from "sweetalert2";
import { useDraggable } from '@dnd-kit/core'
import PriorityBadge from "./PriorityBadge";
import { useUpdateTaskName } from "../hooks/useUpdateTaskName";
import { statusColors } from "../traductor/es";

type TaskCardProps = {
  task: TaskProject;
  canEdit: boolean;
};

export default function TaskCard({ task, canEdit }: TaskCardProps) {
  const {attributes ,listeners, setNodeRef} = useDraggable({
    id: task._id
  });

  const navigate = useNavigate();
  const location = useLocation();
  const paramas = useParams();
  const projectId = paramas.projectId!;
  const updateTaskName = useUpdateTaskName();
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState("")
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const queryClient = useQueryClient();

  const handleTaskNameClick = () => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current)
      clickTimer.current = null
      return
    }
    clickTimer.current = setTimeout(() => {
      clickTimer.current = null
      navigate(location.pathname + `?viewTask=${task._id}`)
    }, 250)
  }

  const handleTaskNameDoubleClick = () => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current)
      clickTimer.current = null
    }
    setEditValue(task.name)
    setIsEditing(true)
  }

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && editValue.trim()) {
      updateTaskName.mutate({
        projectId,
        taskId: task._id,
        name: editValue.trim(),
        description: task.description ?? "",
      })
      setIsEditing(false)
      setEditValue("")
    }
    if (e.key === "Escape") {
      setIsEditing(false)
      setEditValue("")
    }
  }

  const { mutate } = useMutation({
    mutationFn: deleteTaskApi,
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: error.message,
        text: "Ocurrió un error, verifique los datos!",
      });
    },
    onSuccess: (data) => {
      Swal.fire(data?._id, "Tarea eliminada correctamente", "success");
      queryClient.invalidateQueries({ queryKey: ["editProject", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      navigate(location.pathname, { replace: true });
    },
  })


  const cardColors = statusColors[task.status]
  const cardBorder = cardColors?.cardBorder ?? "border-l-transparent"
  const cardBg = cardColors?.cardBg ?? "bg-white"

  return (
    <li className={`group p-5 ${cardBg} rounded-lg shadow-sm border border-slate-100 border-l-4 flex justify-between ${cardBorder}`}>
      <div 
        {...listeners}
        {...attributes}
        ref={setNodeRef}
      className="min-w-0 flex flex-col gap-y-4">
        <div className="flex items-center gap-2">
          {isEditing ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleEditKeyDown}
              onBlur={() => {
                setIsEditing(false)
                setEditValue("")
              }}
              autoFocus
              className="flex-1 text-xl font-bold text-slate-900 border border-brand-primary rounded px-2 py-0.5 focus:outline-none min-w-0"
            />
          ) : (
            <span
              onClick={handleTaskNameClick}
              onDoubleClick={handleTaskNameDoubleClick}
              className="text-xl font-bold text-slate-900 hover:text-slate-700 cursor-pointer"
            >
              {task.name}
            </span>
          )}
          <PriorityBadge priority={task.priority} />
        </div>
        <p className="text-slate-500 text-sm">{task.description}</p>
      </div>
      <div className="flex shrink-0 gap-x-6">
        <Menu as="div" className="relative flex-none opacity-0 group-hover:opacity-100 transition-opacity">
          <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
            <span className="sr-only">opciones</span>
            <EllipsisVerticalIcon className="h-9 w-9" aria-hidden="true" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
              <Menu.Item>
                <button
                  type="button"
                  className="block px-3 py-1 text-sm leading-6 text-gray-900"
                  onClick={() =>
                    navigate(location.pathname + `?viewTask=${task._id}`)
                  }
                >
                  Ver Tarea
                </button>
              </Menu.Item>

              {canEdit && (
                <>
                  <Menu.Item>
                    <button
                      type="button"
                      className="block px-3 py-1 text-sm leading-6 text-gray-900"
                      onClick={() =>
                        navigate(location.pathname + `?editTaskId=${task._id}`)
                      }
                    >
                      Editar Tarea
                    </button>
                  </Menu.Item>

                  <Menu.Item>
                    <button
                      type="button"
                      className="block px-3 py-1 text-sm leading-6 text-red-500"
                      onClick={() => mutate({ projectId, taskId: task._id })}
                    >
                      Eliminar Tarea
                    </button>
                  </Menu.Item>
                </>
              )}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </li>
  );
}
