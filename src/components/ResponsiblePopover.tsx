import { useState } from "react"
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import { useQuery } from "@tanstack/react-query"
import { getProjectMembers } from "../api/team.api"
import type { UserInfo } from "../types"
import { UserIcon } from "@heroicons/react/20/solid"

type ResponsiblePopoverProps = {
  projectId: string
  assignedTo: UserInfo[]
  onAssign: (userIds: string[]) => void
  isPending?: boolean
}

export default function ResponsiblePopover({ projectId, assignedTo, onAssign, isPending = false }: ResponsiblePopoverProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(assignedTo.map((u) => u._id)))

  const { data: members } = useQuery({
    queryKey: ["projectMembers", projectId],
    queryFn: () => getProjectMembers(projectId),
    staleTime: 30000,
  })

  const allUsers = members
    ? [
        { _id: members.manager._id, name: members.manager.name, email: members.manager.email },
        ...members.team,
      ]
    : []

  const toggleUser = (userId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(userId)) next.delete(userId)
      else next.add(userId)
      return next
    })
  }

  const handleSave = (close: () => void) => {
    onAssign(Array.from(selectedIds))
    close()
  }

  const handleClear = () => {
    setSelectedIds(new Set())
  }

  const triggerLabel = () => {
    if (assignedTo.length === 0) return "No asignado"
    const firstName = assignedTo[0].name.split(" ")[0]
    const rest = assignedTo.length - 1
    return rest > 0 ? `${firstName} +${rest}` : firstName
  }

  return (
    <Popover>
      {({ close }) => (
        <>
          <PopoverButton
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border transition-colors
              ${assignedTo.length > 0
                ? "bg-sky-50 text-sky-700 border-sky-200"
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
            className="z-50 w-56 rounded-lg border border-gray-200 bg-white p-2 shadow-xl ring-1 ring-black/5"
          >
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1 pb-1">
              Responsable
            </div>

            <div className="max-h-48 overflow-y-auto space-y-0.5">
              {allUsers.map((user) => {
                const isSelected = selectedIds.has(user._id)
                const isManager = user._id === members?.manager._id
                return (
                  <label
                    key={user._id}
                    className="flex items-center gap-2 px-1 py-1.5 rounded-md hover:bg-slate-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleUser(user._id)}
                      className="h-3.5 w-3.5 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
                    />
                    <span className="text-xs text-slate-700 truncate flex-1">{user.name}</span>
                    {isManager && (
                      <span className="shrink-0 text-[10px] font-semibold uppercase text-brand-light bg-brand-light/10 rounded-full px-1.5">
                        Mgr
                      </span>
                    )}
                  </label>
                )
              })}
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
              <button
                onClick={handleClear}
                className="text-xs text-slate-400 hover:text-red-500 transition-colors px-1"
              >
                Limpiar
              </button>
              <button
                onClick={() => handleSave(close)}
                className="text-xs font-medium text-white bg-sky-600 hover:bg-sky-700 rounded px-3 py-1 transition-colors"
              >
                Guardar
              </button>
            </div>
          </PopoverPanel>
        </>
      )}
    </Popover>
  )
}
