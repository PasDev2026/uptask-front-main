import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { TaskFormData } from "../../types";
import TaskForm from "./TaskForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "../../api/task.api";
import Swal from "sweetalert2";

export default function Modal() {
  //haciendo que el modal sea interactivo
  const navigate = useNavigate();
  
  /*Leer si modal existe  */
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const modalTask = queryParams.get("newTask");
  const show = modalTask ? true : false;
  
  /* Obtener ProjectId */
  const params = useParams()
  const projectId = params.projectId!
    

  const initialValues: TaskFormData = {
    name: "",
    description: "",
    priority: "medium",
  };

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({ defaultValues: initialValues });

  const queryCliente = useQueryClient() //<- invaldiar las consultas repetidas
  //mutación 
  const {mutate} = useMutation({
      mutationFn: createTask,
      onError: (error) => {
        Swal.fire({
            icon: 'error',
            title: error,
            text: 'Algo salió mal. Por favor, inténtalo de nuevo.',
            confirmButtonText: 'Entendido'
          })
      },
      onSuccess: (data) => {  
        queryCliente.invalidateQueries({queryKey: ['editProject', projectId]})
        queryCliente.invalidateQueries({queryKey: ['projectTasks', projectId]})
        Swal.fire({
            icon: 'success',
            title: data,
            text: '😃',
            confirmButtonText: '¡Entendido!'
          })
          reset()
          navigate(location.pathname, { replace: true }) //<- reinicia el formulario y oculta el modal
      }
  })
  

  const handleCreateTask = (formData: TaskFormData) => {
    const data = {
      formData,
      projectId,
    }
    mutate(data)
  }

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

          <div className="fixed inset-0 overflow-y-auto">
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
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                  <Dialog.Title as="h3" className="font-black text-4xl  my-5">
                    Nueva Tarea
                  </Dialog.Title>

                  <p className="text-xl font-bold">
                    Llena el formulario y crea {""}
                    <span className="text-fuchsia-600">una tarea</span>
                  </p>

                  <form className="flex flex-col gap-5 mt-10" noValidate
                    onSubmit={handleSubmit(handleCreateTask)}
                  >
                    
                    <TaskForm register={register} errors={errors} />

                    <button
                      type="submit"
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Guardar Tarea
                    </button>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
