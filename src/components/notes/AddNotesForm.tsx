import { useForm } from "react-hook-form";
import { NoteFormData } from "../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../api/note.api";
import Swal from "sweetalert2";
import { useLocation, useParams } from "react-router-dom";

export default function AddNotesForm() {
    
    const params = useParams()
    
    const location = useLocation()

    const queryParams = new URLSearchParams(location.search);

    const projectId = params.projectId!

    const taskId = queryParams.get('viewTask')! //obteniendo de la ventana modal

    const initialValues: NoteFormData = {
        content: "",
    }

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: createNote,
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: error.message,
        text: "Ocurrió un error, verifique los datos!",
      });
    },
    onSuccess: (data) => {
        Swal  .fire(data, "Nota creada exitosamente :)", "success");
        queryClient.invalidateQueries({queryKey: ['task', taskId]})
    },
  });
  

  const handleaddNote = (formData: NoteFormData) => {
    //console.log(formData, projectId, taskId);
    const data = {projectId, taskId, formData}
    mutate(data)
    reset()
};

  return (
    <form
      onSubmit={handleSubmit(handleaddNote)}
      className="space-y-3"
      noValidate
    >
      <div className="flex flex-col gap-2">
        <label className="font-bold" htmlFor="content">
          Crear Nota
        </label>
        <input
          id="content"
          type="text"
          placeholder="Contenido de la nota"
          className="w-full p-3 border-gray-200 border rounded-lg"
          {...register("content", {
            required: "El Contenido de la nota es obligatorio",
          })}
        />

        {errors.content && <p>{errors.content.message}</p>}
      </div>

      <input
        type="submit"
        value="Crear nota"
        className="bg-sky-600 hover:bg-sky-700 transition-colors cursor-pointer w-full p-3 text-white uppercase font-bold rounded-lg"
      />
    </form>
  );
}
