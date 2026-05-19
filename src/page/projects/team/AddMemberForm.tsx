import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { TeamMemberFormulario } from "../../../types";
import { findUserByEmail } from "../../../api/team.api";
import SearchResult from "./SearchResult";

export default function AddMemberForm() {
  const initialValues: TeamMemberFormulario = {
    email: "",
  };
  const params = useParams();
  const projectId = params.projectId!;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  });

  //usamos mutation para renderizar la lista de usuarios de emails buscados
  const mutation = useMutation({
    //<-mutation. vídeo 587
    mutationFn: findUserByEmail,
  });

  const handleSearchUser = async (formData: TeamMemberFormulario) => {
    const data = { projectId, formData };
    mutation.mutate(data);
  };

  const resetData = () => reset()
  
  const resetMutation = () => mutation.reset()
  

  return (
    <>
      <form
        className="mt-10 space-y-5"
        onSubmit={handleSubmit(handleSearchUser)}
        noValidate
      >
        <div className="flex flex-col gap-3">
          <label className="font-normal text-2xl" htmlFor="email">
            E-mail de Usuario
          </label>
          <input
            id="email"
            type="text"
            placeholder="E-mail del usuario a agregar"
            className="w-full p-3 border-gray-300 border"
            {...register("email", {
              required: "El Email es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <input
          type="submit"
          className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white font-black text-xl cursor-pointer"
          value="Buscar Usuario"
        />
      </form>

      <div className="mt-10">
        {mutation.isPending && <p className="text-center">Cargando...</p>}
        {mutation.error instanceof Error && (
          <p className="text-center">{mutation.error.message}</p>
        )}
        {mutation.data && <SearchResult user={mutation.data} reset = {resetData} resetMutation = {resetMutation}/>}
      </div>
    </>
  );
}
