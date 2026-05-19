import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import { statusTranslation, taskStatusStyles } from "../traductor/es"
import { CheckIcon } from "@heroicons/react/20/solid"
import type { TaskStatus } from "../types"

type TaskStatusPopoverProps = {
    status: TaskStatus
    onSelect: (value: TaskStatus) => void
    isPending?: boolean
}

const OPTIONS: { value: TaskStatus; dotColor: string; hoverBg: string; textColor: string }[] = [
    { value: "pending", dotColor: "bg-slate-500", hoverBg: "hover:bg-slate-50", textColor: "text-slate-700" },
    { value: "onHold", dotColor: "bg-red-500", hoverBg: "hover:bg-red-50", textColor: "text-red-700" },
    { value: "inProgress", dotColor: "bg-blue-500", hoverBg: "hover:bg-blue-50", textColor: "text-blue-700" },
    { value: "underReview", dotColor: "bg-amber-500", hoverBg: "hover:bg-amber-50", textColor: "text-amber-700" },
    { value: "completed", dotColor: "bg-emerald-500", hoverBg: "hover:bg-emerald-50", textColor: "text-emerald-700" },
]

export default function TaskStatusPopover({ status, onSelect, isPending = false }: TaskStatusPopoverProps) {
    const triggerStyle = taskStatusStyles[status]

    const handleSelect = (value: TaskStatus, close: () => void, e?: React.MouseEvent) => {
        e?.stopPropagation()
        onSelect(value)
        close()
    }

    return (
        <Popover>
            {({ close }) => (
                <>
                    <PopoverButton
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors
                            ${triggerStyle}
                            ${isPending ? "opacity-50 pointer-events-none" : ""}
                        `}
                    >
                        {statusTranslation[status]}
                    </PopoverButton>
                    <PopoverPanel
                        anchor="bottom start"
                        className="z-50 w-44 rounded-lg border border-gray-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5"
                    >
                        <div className="space-y-0.5">
                            {OPTIONS.map((opt) => {
                                const isSelected = status === opt.value
                                return (
                                    <button
                                        key={opt.value}
                                        onClick={(e) => handleSelect(opt.value, close, e)}
                                        className={`flex items-center gap-2 w-full px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${opt.textColor} ${opt.hoverBg}`}
                                    >
                                        <span className={`w-2 h-2 rounded-full ${opt.dotColor}`} />
                                        {statusTranslation[opt.value]}
                                        {isSelected && (
                                            <CheckIcon className="ml-auto h-3 w-3" />
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </PopoverPanel>
                </>
            )}
        </Popover>
    )
}
