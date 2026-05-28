import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/20/solid"
import { TABLE_GRID } from "../constants/tableColumns"

type ProjectTableHeaderProps = {
  sortBy?: string
  sortOrder?: string
  onSort: (field: string) => void
}

export default function ProjectTableHeader({ sortBy, sortOrder, onSort }: ProjectTableHeaderProps) {
  const isActive = sortBy === 'projectName'

  return (
    <div
      className="grid items-center px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 bg-white divide-x divide-slate-100"
      style={{ gridTemplateColumns: TABLE_GRID }}
    >
      <div />
      <div
        className="flex items-center gap-1.5 cursor-pointer select-none hover:text-slate-600 transition-colors group"
        onClick={() => onSort('projectName')}
      >
        <span>Proyecto</span>
        <span className="flex flex-col -space-y-1.5 opacity-0 group-hover:opacity-40 transition-opacity">
          <ChevronUpIcon className={`h-3 w-3 ${isActive && sortOrder === 'asc' ? 'opacity-100 text-brand-primary' : 'opacity-30'}`} />
          <ChevronDownIcon className={`h-3 w-3 ${isActive && sortOrder === 'desc' ? 'opacity-100 text-brand-primary' : 'opacity-30'}`} />
        </span>
      </div>
      <div>Sede</div>
      <div>Estado</div>
      <div>Responsable</div>
      <div>Prioridad</div>
      <div>Fecha</div>
      <div>Progreso</div>
      <div />
    </div>
  )
}
