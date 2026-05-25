import { useState, useEffect } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom"
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import { MagnifyingGlassIcon, XMarkIcon, CalendarDaysIcon } from "@heroicons/react/20/solid"
import { DayPicker } from "react-day-picker"
import { es } from "react-day-picker/locale"
import "react-day-picker/style.css"
import { getProjects } from "../../api/project.api"
import Spineer from "../../components/Spineer"
import { useAuth } from "../../hooks/useAuth"
import DeleteProjectModal from "../../components/DeleteProjectModal"
import ProjectTableHeader from "../../components/ProjectTableHeader"
import ProjectTableRow from "../../components/ProjectTableRow"
import { DashboardProject } from "../../types"

function formatDateShort(iso: string) {
    if (!iso) return ""
    const [y, m, d] = iso.split("-")
    return `${d}/${m}/${y}`
}

function toUTCDateString(date: Date | undefined) {
    if (!date) return ""
    const y = date.getUTCFullYear()
    const m = String(date.getUTCMonth() + 1).padStart(2, "0")
    const d = String(date.getUTCDate()).padStart(2, "0")
    return `${y}-${m}-${d}`
}

export default function Dashboard() {
    const { data: user, isLoading: authLoading } = useAuth()
    const [searchParams, setSearchParams] = useSearchParams()
    const [searchInput, setSearchInput] = useState(() => searchParams.get("search") || "")
    const [empresaInput, setEmpresaInput] = useState(() => searchParams.get("empresa") || "")
    const [dateFromInput, setDateFromInput] = useState(() => searchParams.get("dateFrom") || "")
    const [dateToInput, setDateToInput] = useState(() => searchParams.get("dateTo") || "")

    const [debouncedFilters, setDebouncedFilters] = useState({
        search: searchInput,
        empresa: empresaInput,
        dateFrom: dateFromInput,
        dateTo: dateToInput,
    })

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedFilters({
                search: searchInput,
                empresa: empresaInput,
                dateFrom: dateFromInput,
                dateTo: dateToInput,
            })
        }, 350)
        return () => clearTimeout(timer)
    }, [searchInput, empresaInput, dateFromInput, dateToInput])

    useEffect(() => {
        const next = new URLSearchParams(searchParams)
        if (debouncedFilters.search) next.set("search", debouncedFilters.search)
        else next.delete("search")
        if (debouncedFilters.empresa) next.set("empresa", debouncedFilters.empresa)
        else next.delete("empresa")
        if (debouncedFilters.dateFrom) next.set("dateFrom", debouncedFilters.dateFrom)
        else next.delete("dateFrom")
        if (debouncedFilters.dateTo) next.set("dateTo", debouncedFilters.dateTo)
        else next.delete("dateTo")
        setSearchParams(next, { replace: true })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedFilters])

    const {
        data,
        isLoading,
        isFetching,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["projects", debouncedFilters],
        queryFn: async ({ pageParam }) => {
            const result = await getProjects({
                search: debouncedFilters.search || undefined,
                empresa: debouncedFilters.empresa || undefined,
                dateFrom: debouncedFilters.dateFrom || undefined,
                dateTo: debouncedFilters.dateTo || undefined,
                offset: pageParam as number,
                limit: 10,
            })
            if (!result) throw new Error("No data")
            return result
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            const loadedCount = allPages.reduce((sum, page) => sum + page.projects.length, 0)
            return loadedCount < lastPage.total ? loadedCount : undefined
        },
        retry: false,
        placeholderData: (prev) => prev,
    })

    const projects = data?.pages.flatMap(page => page.projects) ?? []

    const isSearching = searchInput !== debouncedFilters.search
        || empresaInput !== debouncedFilters.empresa
        || dateFromInput !== debouncedFilters.dateFrom
        || dateToInput !== debouncedFilters.dateTo

    const hasActiveFilters = debouncedFilters.search || debouncedFilters.empresa || debouncedFilters.dateFrom || debouncedFilters.dateTo

    const dateRangeLabel = dateFromInput && dateToInput
        ? `${formatDateShort(dateFromInput)} \u2192 ${formatDateShort(dateToInput)}`
        : dateFromInput
            ? `Desde ${formatDateShort(dateFromInput)}`
            : dateToInput
                ? `Hasta ${formatDateShort(dateToInput)}`
                : "Filtrar por fechas"

    const clearAllFilters = () => {
        setSearchInput("")
        setEmpresaInput("")
        setDateFromInput("")
        setDateToInput("")
    }

    if (isLoading && authLoading) return <Spineer />
    if (data && user)
        return (
            <div>
                <h1 className="text-5xl font-black">Mis proyectos</h1>
                <p className="text-2xl font-light text-gray-500 mt-5">
                    Maneja y administra tus proyectos
                </p>

                <div className="flex flex-wrap items-end gap-3 mt-8">
                    <div className="relative flex-1 min-w-[300px] max-w-md">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Buscar proyecto..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full pl-10 pr-10 py-2.5 text-sm border border-slate-200 rounded-lg bg-white shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors"
                        />
                        {searchInput && !(isSearching || isFetching) && (
                            <button
                                onClick={() => setSearchInput("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        )}
                        {(isSearching || isFetching) && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <div className="h-4 w-4 border-2 border-slate-300 border-t-brand-primary rounded-full animate-spin" />
                            </div>
                        )}
                    </div>

                    <select
                        value={empresaInput}
                        onChange={(e) => setEmpresaInput(e.target.value)}
                        className="shrink-0 px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white shadow-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors"
                    >
                        <option value="">Todas las sedes</option>
                        {user.empresas?.map((e) => (
                            <option key={e._id} value={e._id}>{e.nombre}</option>
                        ))}
                    </select>
                    <Popover className="relative shrink-0">
                        <PopoverButton className="flex items-center gap-2 px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white shadow-sm text-slate-600 hover:text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-colors">
                            <CalendarDaysIcon className="h-5 w-5 text-slate-400" />
                            <span>{dateRangeLabel}</span>
                            {(dateFromInput || dateToInput) && (
                                <span className="h-2 w-2 rounded-full bg-brand-primary shrink-0" />
                            )}
                        </PopoverButton>
                        <PopoverPanel
                            anchor="bottom start"
                            className="z-50 mt-1 w-[340px] rounded-lg border border-slate-200 bg-white p-4 shadow-lg ring-1 ring-black/5"
                            style={{
                                "--rdp-accent-color": "#2DAAA5",
                                "--rdp-accent-background-color": "#E6F7F6",
                            } as React.CSSProperties}
                        >
                            <DayPicker
                                mode="range"
                                selected={
                                    dateFromInput || dateToInput
                                        ? {
                                            from: dateFromInput ? (([y,m,d]) => new Date(+y, +m-1, +d))(dateFromInput.split("-") as [string, string, string]) : undefined,
                                            to: dateToInput ? (([y,m,d]) => new Date(+y, +m-1, +d))(dateToInput.split("-") as [string, string, string]) : undefined,
                                        }
                                        : undefined
                                }
                                onSelect={(range) => {
                                    if (!range) {
                                        setDateFromInput("")
                                        setDateToInput("")
                                        return
                                    }
                                    setDateFromInput(toUTCDateString(range.from))
                                    setDateToInput(toUTCDateString(range.to))
                                }}
                                locale={es}
                                weekStartsOn={1}
                                showOutsideDays
                                fixedWeeks
                                className="[&_.rdp-root]:m-0"
                            />
                            <div className="mt-3 flex justify-end border-t border-slate-100 pt-3">
                                <button
                                    onClick={() => { setDateFromInput(""); setDateToInput("") }}
                                    className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
                                >
                                    Limpiar fechas
                                </button>
                            </div>
                        </PopoverPanel>
                    </Popover>

                    {(searchInput || empresaInput || dateFromInput || dateToInput) && (
                        <button
                            onClick={clearAllFilters}
                            className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-slate-500 hover:text-slate-700 transition-colors shrink-0"
                        >
                            <XMarkIcon className="h-4 w-4" />
                            Limpiar filtros
                        </button>
                    )}
                </div>

                {projects.length ? (
                    <div className="border border-slate-100 mt-6 bg-white">
                        <ProjectTableHeader />
                        {projects.map((project: DashboardProject) => (
                            <ProjectTableRow key={project._id} project={project} user={user} />
                        ))}
                        {hasNextPage && (
                            <div className="flex justify-center py-4">
                                <button
                                    onClick={() => fetchNextPage()}
                                    disabled={isFetchingNextPage}
                                    className="px-6 py-2 text-sm font-medium text-brand-primary hover:text-brand-primary/80 border border-brand-primary rounded-lg hover:bg-brand-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isFetchingNextPage ? "Cargando..." : "Cargar más"}
                                </button>
                            </div>
                        )}
                    </div>
                ) : hasActiveFilters ? (
                    <p className="text-xl font-light text-gray-500 mt-10 text-center">
                        No se encontraron resultados
                        {debouncedFilters.search && (
                            <> para <span className="font-medium">&quot;{debouncedFilters.search}&quot;</span></>
                        )}
                        {(debouncedFilters.dateFrom || debouncedFilters.dateTo) && (
                            <> en el rango de fechas seleccionado</>
                        )}
                        {debouncedFilters.empresa && (
                            <> en la sede seleccionada</>
                        )}
                    </p>
                ) : (
                    <p className="text-2xl font-light text-gray-500 mt-5">
                        No hay proyectos aún
                    </p>
                )}
                <DeleteProjectModal />
            </div>
        )
}
