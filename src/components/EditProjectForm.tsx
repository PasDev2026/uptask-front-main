import { useMutation, useQueryClient } from "@tanstack/react-query";
import Form from "../page/projects/Form";
import { Project, ProjectFormData } from "../types";
import { useForm } from "react-hook-form";
import { updateProject } from "../api/project.api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

type EditPrjectFormData = {
  data: ProjectFormData;
  projectId: Project["_id"];
};

export default function EditProjectForm({
  data,
  projectId,
}: EditPrjectFormData) {

    const navigate = useNavigate()
  //rellenando automaticamente el formulario
  const { projectName, clientName, description, startDate, dueDate } = data;
  const startDateValue = startDate ? startDate.split('T')[0] : undefined;
  const dueDateValue = dueDate ? dueDate.split('T')[0] : undefined;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({ defaultValues: { projectName, clientName, description, startDate: startDateValue, dueDate: dueDateValue } });


  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: updateProject,
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: error.message,
        text: "Ocurrió un error, verifique los datos!",
      });
    },
    onSuccess: (data) => {
      Swal.fire(data, "Proyecto editado correctamente", "success")
      queryClient.invalidateQueries({queryKey: ['projects']})
      queryClient.invalidateQueries({queryKey: ['editProject', projectId]}) //consultas invalidas
      navigate("/dashboard");
    },
  });

  const handleForm = (formData: ProjectFormData) => {
    const data = { formData, projectId };
    mutate(data);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold uppercase text-center mb-10">
        Edita tu proyecto
      </h1>

      <form
        className="max-w-sm mx-auto"
        onSubmit={handleSubmit(handleForm)}
        noValidate
      >
        <Form register={register} errors={errors} />

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
