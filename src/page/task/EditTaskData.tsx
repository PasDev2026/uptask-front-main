/* Este archivo hace consulta al id */

import { useQuery } from "@tanstack/react-query";
import { Navigate, useLocation, useParams } from "react-router-dom"
import { getTaskById } from "../../api/task.api";
import EditTaskModal from "./EditTaskModal";


export default function EditTaskData() {

  const params = useParams()
  const projectId = params.projectId!
    

  //extraer el id para editarlo
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get('editTaskId')! //<---- ojo
  console.log(taskId);

  const {data, isError} = useQuery({
    queryKey: ['task',taskId],
    queryFn: () => getTaskById({projectId, taskId}),
    enabled: !!taskId //convierte a booleano
  })

  if(isError) return <Navigate  to='/404'/>
  
  if(data) return <EditTaskModal data={data} taskId={taskId}/>
  
}
