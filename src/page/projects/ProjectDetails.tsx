import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import { getFullProjectDetails } from "../../api/project.api"
import { useQuery } from "@tanstack/react-query"
import Modal from "../task/Modal"
import TaskList from "../task/TaskList"
import EditTaskData from "../task/EditTaskData"
import TaskModalDetails from "../task/TaskModalDetails"
import Spineer from "../../components/Spineer"
import { useAuth } from "../../hooks/useAuth"
import isManager from "../../util/policies"
import { useMemo } from "react"
import { FullProjectDetails } from "../../types"
import DeadlineBadge from "../../components/DeadlineBadge"
import DateBadge from "../../components/DateBadge"

export default function ProjectDetails() {

  const { data: user, isLoading: authLoading } = useAuth()

  const navigate = useNavigate()

  const params = useParams()
  const projectId = params.projectId!
  
  const {data, isLoading,isError} = useQuery<FullProjectDetails>({ 
    queryKey: ['editProject', projectId], //-ojito aqui //me confundí: en vez de editProject debería de ser solo 'project' para la mutación pero igual funciona
    queryFn: async () => {
      const result = await getFullProjectDetails(projectId)
      if (!result) throw new Error("No data")
      return result
    },
    retry: false,
  })

  const canEdit = useMemo(() => data?.manager === user?._id , [data, user])

  if(isLoading && authLoading) return <Spineer />
  if(isError) return <Navigate to='/404'/>
  if (data && user) return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 pb-6 border-b border-slate-100">
        <div className="space-y-2 max-w-3xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">{data.projectName}</h1>
          <p className="text-sm font-medium text-slate-400 leading-relaxed">{data.description}</p>
          <div className="flex flex-wrap items-center gap-2 pt-1.5">
            <DateBadge date={data.startDate} />
            <DeadlineBadge dueDate={data.dueDate} isOverdue={data.isOverdue} />
          </div>
        </div>

        {isManager(data.manager, user._id) && (
          <div className="flex items-center gap-2 shrink-0 self-start md:self-center mt-2 md:mt-0">
            <button
              onClick={() => navigate("?newTask=true")}
              type="button"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-brand-primary hover:bg-brand-hover text-white text-sm font-bold rounded-lg shadow-sm shadow-brand-primary/10 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer shrink-0"
            >
              <svg className="w-4 h-4 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Agregar Tarea
            </button>
            <Link
              to="team"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-brand-primary hover:bg-brand-hover text-white text-sm font-bold rounded-lg shadow-sm shadow-brand-primary/10 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer shrink-0"
            >
              <svg className="w-4 h-4 stroke-[2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a6 6 0 0 0-3.44-10.67 6 6 0 0 0-3.44 10.67m6 0v1.5a1.5 1.5 0 0 1-1.5 1.5h-9a1.5 1.5 0 0 1-1.5-1.5v-1.5M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              Colaboradores
            </Link>
          </div>
        )}
      </div>

      <TaskList
        tasks={data.tasks}
        canEdit={canEdit}
      />

      {/* Modales ventana flotante */}
      <Modal />
      <EditTaskData />
      <TaskModalDetails />
    </div>
  );
  

}
