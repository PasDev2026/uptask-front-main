import { TABLE_GRID } from "../constants/tableColumns"

export default function ProjectTableHeader() {
  return (
    <div
      className="grid items-center px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 bg-white divide-x divide-slate-100"
      style={{ gridTemplateColumns: TABLE_GRID }}
    >
      <div />
      <div>Proyecto</div>
      <div>Estado</div>
      <div>Responsable</div>
      <div>Prioridad</div>
      <div>Fecha</div>
      <div>Progreso</div>
      <div />
    </div>
  )
}
