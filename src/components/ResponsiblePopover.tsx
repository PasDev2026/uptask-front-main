import { useState } from "react"
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import { useQuery } from "@tanstack/react-query"
import { getProjectSedeUsers } from "../api/team.api"
import { UserIcon, MagnifyingGlassIcon, CheckIcon } from "@heroicons/react/20/solid"

const AREA_ABBR: Record<string, string> = {
  ti: "TI",
  contabilidad: "CON",
  finanzas: "FIN",
  marketing: "MAR",
  talentos: "TAL",
  operaciones: "OPE",
}

function formatArea(area: { _id: string; name: string } | null | undefined): string | null {
  if (!area) return null
  return AREA_ABBR[area.name] ?? area.name.slice(0, 3).toUpperCase()
}

type ResponsiblePopoverProps = {
  projectId: string
  assignedTo: { _id: string; name: string; email?: string | null }[]
  onAssign: (userIds: string[]) => void
  isPending?: boolean
}

export default function ResponsiblePopover({ projectId, assignedTo, onAssign, isPending = false }: ResponsiblePopoverProps) {
  const [search, setSearch] = useState("")

  const { data: users = [] } = useQuery({
    queryKey: ["projectSedeUsers", projectId, search],
    queryFn: () => getProjectSedeUsers(projectId, search || undefined),
    staleTime: 30000,
  })

  const validUserIds = new Set(users.map(u => u._id))
  const selectedIds = new Set(
    assignedTo.filter(u => validUserIds.has(u._id)).map(u => u._id)
  )

  const toggleUser = (userId: string) => {
    const next = new Set(selectedIds)
    if (next.has(userId)) next.delete(userId)
    else next.add(userId)
    onAssign(Array.from(next))
  }

  const triggerLabel = () => {
    if (assignedTo.length === 0) return "No asignado"
    const firstName = assignedTo[0].name.split(" ")[0]
    const rest = assignedTo.length - 1
    return rest > 0 ? `${firstName} +${rest}` : firstName
  }

  return (
    <Popover>
      {() => (
        <>
          <PopoverButton
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border transition-colors
              ${assignedTo.length > 0
                ? "bg-brand-primary/10 text-brand-primary border-brand-primary/20"
                : "bg-slate-50 text-slate-400 border-slate-200"
              }
              ${isPending ? "opacity-50 pointer-events-none" : ""}
            `}
          >
            <UserIcon className="h-3 w-3" />
            {triggerLabel()}
          </PopoverButton>

          <PopoverPanel
            anchor="bottom start"
            className="z-50 w-64 rounded-lg border border-gray-200 bg-white p-3 shadow-xl ring-1 ring-black/5"
          >
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1 pb-2">
              Responsable
            </div>

            <div className="relative mb-2">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-md border border-slate-200 pl-8 pr-2.5 py-1.5 text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>

            <div className="max-h-56 overflow-y-auto space-y-0.5">
              {users.map((user) => {
                const isSelected = selectedIds.has(user._id)
                const initial = user.apellido_paterno?.charAt(0) ?? ""
                const areaLabel = formatArea(user.area)
                return (
                  <div
                    key={user._id}
                    onClick={() => toggleUser(user._id)}
                    className={`flex items-center gap-2.5 px-2 py-2 rounded-md cursor-pointer transition-colors 
                      ${isSelected ? "bg-brand-primary/5" : "hover:bg-brand-primary/5"}`}
                  >
                    <div className="flex-1 min-w-0 flex items-center gap-1.5">
                      <span className={`text-xs font-medium truncate ${isSelected ? "text-brand-primary" : "text-slate-700"}`}>
                        {user.name}{initial ? ` ${initial}.` : ""}
                      </span>
                      {areaLabel && (
                        <span className="shrink-0 text-[10px] font-semibold uppercase text-brand-primary bg-brand-primary/10 rounded px-1.5 py-0.5 leading-tight">
                          {areaLabel}
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <CheckIcon className="h-4 w-4 text-brand-primary shrink-0" />
                    )}
                  </div>
                )
              })}
              {users.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-6">No se encontraron usuarios</p>
              )}
            </div>

          </PopoverPanel>
        </>
      )}
    </Popover>
  )
}
