import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TeamMember } from "../../../types";
import { addUserToProject } from "../../../api/team.api";
import Swal from "sweetalert2";
import { useNavigate , useParams } from "react-router-dom";

export type SearchResultProps = {
  user: TeamMember
  reset: () => void
  resetMutation: () => void
};

export default function SearchResult({ user, reset, resetMutation }: SearchResultProps) {
    const navigate = useNavigate()

    const params = useParams()
    const projectId = params.projectId!

    const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: addUserToProject,
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: error.message,
        text: "Ocurrió un error, El usuario ya pudo estar agregado overifique los datos!",
      });
    },
    onSuccess: (data) => {
      Swal.fire(data, "Usuario agregado al proyecto correctamente", "success")
      reset()
      resetMutation()
      navigate(location.pathname, {replace:true})

      //invalidando la query
      queryClient.invalidateQueries({queryKey: ['projectTeam', projectId]})
    },
  })

  const handleAddUsertoProject = () => {
      const data = {projectId,id:user._id}
      mutate(data)
  }

  return (
    <>
      <p className="mt-10 text-center font-bold"> Resultado: </p>
      <div className="flex justify-between items-center">
        <p className="font-bold">Nombre: {user.name}</p>
        <button
          type="button"
          className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            onClick={ handleAddUsertoProject}
        >
          Agregar al proyecto
        </button>
      </div>
    </>
  );
}
