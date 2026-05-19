import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import { priorityTranslation, priorityStyles } from "../traductor/es"
import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid"
import type { TaskPriority } from "../types"

type PriorityPopoverProps = {
    priority: TaskPriority
    onSelect: (value: TaskPriority) => void
    isPending?: boolean
}

const OPTIONS: { value: "high" | "medium" | "low"; dotColor: string; hoverBg: string; textColor: string }[] = [
    { value: "high", dotColor: "bg-red-500", hoverBg: "hover:bg-red-50", textColor: "text-red-700" },
    { value: "medium", dotColor: "bg-amber-500", hoverBg: "hover:bg-amber-50", textColor: "text-amber-700" },
    { value: "low", dotColor: "bg-green-500", hoverBg: "hover:bg-green-50", textColor: "text-green-700" },
]

export default function PriorityPopover({ priority, onSelect, isPending = false }: PriorityPopoverProps) {
    const hasPriority = !!priority
    const triggerStyle = hasPriority && priority
        ? priorityStyles[priority]
        : "bg-transparent text-gray-400 border-dashed border-gray-300"

    const handleSelect = (value: TaskPriority, close: () => void, e?: React.MouseEvent) => {
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
                        {hasPriority && priority ? priorityTranslation[priority] : "—"}
                    </PopoverButton>
                    <PopoverPanel
                        anchor="bottom start"
                        className="z-50 w-40 rounded-lg border border-gray-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5"
                    >
                        <div className="space-y-0.5">
                            {OPTIONS.map((opt) => {
                                const isSelected = priority === opt.value
                                return (
                                    <div
                                        key={opt.value}
                                        className={`flex items-center rounded-md transition-colors ${opt.hoverBg}`}
                                    >
                                        <button
                                            onClick={(e) => handleSelect(opt.value, close, e)}
                                            className={`flex items-center gap-2 flex-1 px-2 py-1.5 text-xs font-medium transition-colors ${opt.textColor}`}
                                        >
                                            <span className={`w-2 h-2 rounded-full ${opt.dotColor}`} />
                                            {priorityTranslation[opt.value]}
                                            {isSelected && (
                                                <CheckIcon className="ml-auto h-3 w-3" />
                                            )}
                                        </button>
                                        {isSelected && (
                                            <button
                                                onClick={(e) => handleSelect(null, close, e)}
                                                className="p-1.5 mr-1 text-gray-400 hover:text-gray-600 rounded-md transition-colors"
                                            >
                                                <XMarkIcon className="h-3 w-3" />
                                            </button>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </PopoverPanel>
                </>
            )}
        </Popover>
    )
}
