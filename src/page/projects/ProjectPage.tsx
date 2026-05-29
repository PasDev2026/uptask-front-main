//import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Form from "./Form";
import { ProjectFormData } from "../../types";
import { createProject } from "../../api/project.api";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function ProjectPage() {

  const navigate = useNavigate()

  const initialValues: ProjectFormData = {
    projectName: "",
    description: "",
    empresa: "",
    dueDate: undefined,
  };

  const {register, handleSubmit, formState: { errors }, setValue} = useForm({ defaultValues: initialValues });

  const mutatiton = useMutation({
      mutationFn: createProject,
      onError: (error) => {
        Swal.fire({
          icon: "error",
          title: error.message,
          text: "Ocurrió un error, verifique los datos!",
        });
      },
      onSuccess: (data) => {
        Swal.fire(data, 'Proyecto Creado :)', 'success');
        navigate('/dashboard')
      }
  })

  const handleForm = (formData: ProjectFormData) => {
    mutatiton.mutateAsync(formData)
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold uppercase text-center mb-10">Crea tu proyecto</h1>

      <form 
        className="max-w-md mx-auto flex flex-col gap-6"
        onSubmit={handleSubmit(handleForm)}
        noValidate
      >
        
        <Form
          register={register}
          errors={errors}
          setValue={setValue}
        />

        <button
          type="submit"
          className="w-full bg-brand-primary hover:bg-brand-dark text-white font-medium rounded-lg px-4 py-2.5 transition-colors"
        >
          Crear Proyecto
        </button>
      </form>
    </div>
  );
}
