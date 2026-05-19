import { useState, useCallback, useEffect, useRef } from "react"
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import { DayPicker } from "react-day-picker"
import { es } from "react-day-picker/locale"
import { format, parse } from "date-fns"
import "react-day-picker/style.css"
import { useUpdateProjectDates } from "../hooks/useUpdateProjectDates"
import { formatDateShort } from "../util/format-date"

type DateCellPopoverProps = {
    projectId: string
    startDate?: string | null
    dueDate?: string | null
    isOverdue?: boolean
}

function toDate(iso: string | null | undefined): Date | undefined {
    if (!iso) return undefined
    const d = new Date(iso)
    return isNaN(d.getTime()) ? undefined : d
}

export default function DateCellPopover({ projectId, startDate, dueDate, isOverdue }: DateCellPopoverProps) {
    const { mutate, isPending } = useUpdateProjectDates()
    const [hasEndDate, setHasEndDate] = useState(!!dueDate)
    const [range, setRange] = useState<{ from?: Date; to?: Date }>({
        from: toDate(startDate),
        to: toDate(dueDate),
    })
    const initialRef = useRef({ startDate, dueDate })

    const displayText =
        formatDateShort(startDate) && formatDateShort(dueDate)
            ? `${formatDateShort(startDate)} → ${formatDateShort(dueDate)}`
            : formatDateShort(startDate) || formatDateShort(dueDate) || "Añadir fecha"

    const hasDates = !!startDate || !!dueDate

    const dueStatus = (() => {
        if (!dueDate) return 'none' as const
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const date = new Date(dueDate)
        const daysUntilDue = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        if (isOverdue || daysUntilDue < 0) return 'overdue' as const
        if (daysUntilDue <= 1) return 'near' as const
        return 'normal' as const
    })()

    const dateInputValue = (date: Date | undefined) =>
        date ? format(date, "yyyy-MM-dd") : ""

    const handleDateInputChange = (side: "from" | "to", value: string) => {
        if (!value) {
            setRange((prev) => ({ ...prev, [side]: undefined }))
            return
        }
        const parsed = parse(value, "yyyy-MM-dd", new Date())
        if (!isNaN(parsed.getTime())) {
            setRange((prev) => ({ ...prev, [side]: parsed }))
        }
    }

    const hasChanged = (): boolean => {
        const init = initialRef.current
        const nowFrom = range.from?.toISOString() ?? null
        const nowTo = range.to?.toISOString() ?? null
        return nowFrom !== (toDate(init.startDate)?.toISOString() ?? null) ||
            nowTo !== (toDate(init.dueDate)?.toISOString() ?? null)
    }

    const handleSave = useCallback(() => {
        if (!hasChanged()) return
        mutate({
            projectId,
            dates: {
                startDate: range.from ? range.from.toISOString() : null,
                dueDate: hasEndDate && range.to ? range.to.toISOString() : null,
            },
        })
    }, [range, hasEndDate, projectId, mutate])

    useEffect(() => {
        if (range.from && range.to && hasEndDate && hasChanged()) {
            handleSave()
        }
    }, [range.from?.getTime(), range.to?.getTime(), hasEndDate])

    useEffect(() => {
        initialRef.current = { startDate, dueDate }
        setRange({ from: toDate(startDate), to: toDate(dueDate) })
        setHasEndDate(!!dueDate)
    }, [startDate, dueDate])

    return (
        <Popover>
            {({ open }) => (
                <>
                    <PopoverButton
                        className={`text-left text-sm transition-colors rounded px-1 py-0.5 -ml-1
                            ${!hasDates
                                ? "text-slate-400 hover:text-brand-primary hover:bg-brand-primary/5"
                                : dueStatus === 'overdue'
                                    ? "text-red-600 hover:text-red-700 hover:bg-red-50"
                                    : dueStatus === 'near'
                                        ? "text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                        : "text-slate-700 hover:text-brand-primary hover:bg-brand-primary/5"
                            }
                            ${isPending ? "opacity-50 pointer-events-none" : ""}
                        `}
                    >
                        {displayText}
                    </PopoverButton>
                    <PopoverPanel
                        anchor="bottom start"
                        className="z-50 mt-1 w-[320px] rounded-lg border border-slate-200 bg-white p-4 shadow-lg ring-1 ring-black/5"
                        style={{
                            "--rdp-accent-color": "#2DAAA5",
                            "--rdp-accent-background-color": "#E6F7F6",
                            "--rdp-day-height": "36px",
                            "--rdp-day-width": "36px",
                            "--rdp-day_button-height": "34px",
                            "--rdp-day_button-width": "34px",
                        } as React.CSSProperties}
                    >
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <label className="text-xs font-medium text-slate-500 w-20">
                                        Start date
                                    </label>
                                    <input
                                        type="date"
                                        value={dateInputValue(range.from)}
                                        onChange={(e) => handleDateInputChange("from", e.target.value)}
                                        className="flex-1 rounded border border-slate-200 px-2 py-1 text-xs focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="text-xs font-medium text-slate-500 w-20">
                                        End date
                                    </label>
                                    <div className="flex-1 flex items-center gap-2">
                                        <input
                                            type="date"
                                            value={hasEndDate ? dateInputValue(range.to) : ""}
                                            onChange={(e) => handleDateInputChange("to", e.target.value)}
                                            disabled={!hasEndDate}
                                            className="flex-1 rounded border border-slate-200 px-2 py-1 text-xs focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                                        />
                                        <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                checked={hasEndDate}
                                                onChange={(e) => {
                                                    setHasEndDate(e.target.checked)
                                                    if (!e.target.checked) {
                                                        setRange((prev) => ({ ...prev, to: undefined }))
                                                    }
                                                }}
                                                className="rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
                                            />
                                            End date
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-3">
                                <DayPicker
                                    mode="range"
                                    selected={range.from || range.to ? { from: range.from, to: hasEndDate ? range.to : undefined } : undefined}
                                    onSelect={(selected) => {
                                        if (!selected) {
                                            setRange({})
                                            return
                                        }
                                        setRange({
                                            from: selected.from,
                                            to: selected.to,
                                        })
                                        if (!hasEndDate && selected.from) {
                                            setHasEndDate(true)
                                        }
                                    }}
                                    locale={es}
                                    weekStartsOn={1}
                                    showOutsideDays
                                    fixedWeeks
                                    className="[&_.rdp-root]:m-0"
                                />
                            </div>

                            <div className="border-t border-slate-100 pt-2 flex justify-end">
                                <PopoverButton
                                    onClick={handleSave}
                                    className="rounded-md bg-brand-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-light transition-colors disabled:opacity-50"
                                    disabled={isPending}
                                >
                                    {isPending ? "Guardando..." : "Done"}
                                </PopoverButton>
                            </div>
                        </div>
                    </PopoverPanel>
                </>
            )}
        </Popover>
    )
}
