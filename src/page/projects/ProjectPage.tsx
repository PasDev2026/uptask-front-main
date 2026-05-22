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
    clientName: "",
    description: "",
    empresa: "",
    dueDate: undefined,
  };

  const {register, handleSubmit, formState: { errors }} = useForm({ defaultValues: initialValues });

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
        className="max-w-sm mx-auto"
        onSubmit={handleSubmit(handleForm)}
        noValidate
      >
        
        <Form
          register={register}
          errors={errors}
        />

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Crear Proyecto
        </button>
      </form>
    </div>
  );
}
