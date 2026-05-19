import { useQuery } from "@tanstack/react-query"
import { Navigate, useParams } from "react-router-dom"
import { getProjectsById } from "../../api/project.api"
import EditProjectForm from "../../components/EditProjectForm"

export default function Edit() {
  const params = useParams()
  const projectId = params.projectId! // ! dice que el projecto siempre va a existir


  const {data, isLoading,isError} = useQuery({ 
    queryKey: ['editProject', projectId],
    queryFn: () => getProjectsById(projectId),
    retry: false,
  })
 
  if(isLoading) return "Cargando..."
  if(isError) return <Navigate to='/404'/>
  if(data) return <EditProjectForm data={data} projectId={projectId}/>
  
}
