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
  const { projectName, clientName, description, empresa, startDate, dueDate } = data;
  const startDateValue = startDate ? startDate.split('T')[0] : undefined;
  const dueDateValue = dueDate ? dueDate.split('T')[0] : undefined;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({ defaultValues: { projectName, clientName, description, empresa, startDate: startDateValue, dueDate: dueDateValue } });


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
        className="max-w-md mx-auto flex flex-col gap-6"
        onSubmit={handleSubmit(handleForm)}
        noValidate
      >
        <Form register={register} errors={errors} hideEmpresa />

        <button
          type="submit"
          className="w-full bg-brand-primary hover:bg-brand-dark text-white font-medium rounded-lg px-4 py-2.5 transition-colors"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
