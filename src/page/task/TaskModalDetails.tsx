import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { getTaskById, updateStatusTask } from "../../api/task.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { formatDate } from "../../util/format-date";
import { statusTranslation, priorityTranslation } from "../../traductor/es";
import { TaskStatus } from "../../types";
import PriorityBadge from "../../components/PriorityBadge";
import NotesPanel from "../../components/notes/NotesPanel";
import SubtaskChecklist from "../../components/tasks/SubtaskChecklist";

export default function TaskModalDetails() {
  const params = useParams();
  const projectId = params.projectId!;
  const queryCliente = useQueryClient();

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get("viewTask")!;

  const show = taskId ? true : false;

  const { data, isError, error } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => getTaskById({ projectId, taskId }),
    enabled: !!taskId, //convierte a booleano
    retry: false,
  });

  //Aqui se maneja el esatdo de las tareas
  const { mutate } = useMutation({
    mutationFn: updateStatusTask,
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: error,
        text: "Algo salió mal. Por favor, inténtalo de nuevo.",
        confirmButtonText: "Entendido",
      });
    },
    onSuccess: (data) => {
      queryCliente.invalidateQueries({ queryKey: ["editProject", projectId] });
      queryCliente.invalidateQueries({ queryKey: ["task", taskId] });
      queryCliente.invalidateQueries({ queryKey: ["projectTasks", projectId] });
      Swal.fire({
        icon: "success",
        title: data,
        text: "😃",
        confirmButtonText: "¡Entendido!",
      });
      //navigate(location.pathname, { replace: true }); //<- reinicia el formulario y oculta el modal
    },
  });

  //funcion para seleccionar el estado del select
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const data = { projectId, taskId, status: e.target.value as TaskStatus };
    mutate(data);
  };

  if (isError) {
    Swal.fire({
      icon: "error",
      title: error.message,
      text: "Ocurrió un error, verifique los datos!",
    });
    return <Navigate to={`/dashboard`} />;
  }

  if (data)
    return (
      <>
        <Transition appear show={show} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => navigate(location.pathname, { replace: true })}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/60" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-hidden">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-4xl h-[85vh] max-h-[85vh] flex flex-col overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-8">
                    <div className="flex-shrink-0">
                      <p className="text-sm text-slate-400">
                        Agregada el: {formatDate(data.createdAt)}{" "}
                      </p>
                      <p className="text-sm text-slate-400">
                        Última actualización: {formatDate(data.updatedAt)}{" "}
                      </p>
                      <Dialog.Title
                        as="h3"
                        className="font-black text-4xl text-slate-600 my-5"
                      >
                        {data.name}
                      </Dialog.Title>
                    </div>

                    <div className="flex flex-1 min-h-0 gap-8 overflow-hidden">
                      {/* Left column ~70%: description + subtasks */}
                      <div className="flex-1 overflow-y-auto pr-4 space-y-8">
                        <p className="text-lg text-slate-500">
                          {data.description}
                        </p>

                        <SubtaskChecklist
                          projectId={projectId}
                          taskId={taskId}
                        />
                      </div>

                      {/* Right column ~30%: status, timeline, notes */}
                      <div className="w-80 shrink-0 bg-slate-50/80 rounded-xl p-6 flex flex-col gap-y-8 border border-slate-100 overflow-y-auto">
                        {/* Priority */}
                        <div className="flex flex-col gap-y-3">
                          <label className="text-xs font-bold text-gray-500 tracking-wider uppercase">
                            Prioridad
                          </label>
                          <PriorityBadge priority={data.priority} />
                        </div>

                        {/* Dates */}
                        <div className="flex flex-col gap-y-3">
                          <label className="text-xs font-bold text-gray-500 tracking-wider uppercase">
                            Cronograma
                          </label>
                          <div className="space-y-2 text-sm">
                            {data.startDate ? (
                              <div className="flex justify-between">
                                <span className="text-slate-500">Inicio:</span>
                                <span className="font-medium text-slate-700">{formatDate(data.startDate)}</span>
                              </div>
                            ) : (
                              <div className="flex justify-between">
                                <span className="text-slate-500">Inicio:</span>
                                <span className="text-slate-400 italic">Sin definir</span>
                              </div>
                            )}
                            {data.dueDate ? (
                              <div className="flex justify-between">
                                <span className="text-slate-500">Límite:</span>
                                <span className="font-medium text-slate-700">{formatDate(data.dueDate)}</span>
                              </div>
                            ) : (
                              <div className="flex justify-between">
                                <span className="text-slate-500">Límite:</span>
                                <span className="text-slate-400 italic">Sin definir</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Status selector */}
                        <div className="flex flex-col gap-y-3">
                          <label className="text-xs font-bold text-gray-500 tracking-wider uppercase">
                            Estado actual
                          </label>
                          <select
                            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg"
                            onChange={handleChange}
                            value={data.status}
                          >
                            {Object.entries(statusTranslation).map(
                              ([key, value]) => (
                                <option key={key} value={key}>
                                  {value}
                                </option>
                              )
                            )}
                          </select>
                        </div>

                        {/* Compact timeline */}
                        {data.completedBy.length ? (
                          <div className="flex flex-col gap-y-3">
                            <h4 className="text-xs font-bold text-gray-500 tracking-wider uppercase">
                              Historial de cambios
                            </h4>
                            <ul className="relative border-l-2 border-slate-300 ml-2">
                              {data.completedBy.map((activityLog) => (
                                <li key={activityLog._id} className="mb-5 ml-5">
                                  <div className="absolute -left-[13px] w-4 h-4 bg-slate-500 rounded-full border-2 border-white" />
                                  <div className="text-xs">
                                    <span className="font-semibold text-slate-600">
                                      {statusTranslation[activityLog.status]}
                                    </span>{" "}
                                    <span className="text-slate-400">por:</span>{" "}
                                    <span className="text-sm text-gray-600">
                                      {activityLog.user.name}
                                    </span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}

                        {/* Notes */}
                        <NotesPanel notes={data.notes} />
                      </div>
                    </div>

                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
    );
}
