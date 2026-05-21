import { Fragment } from "react"
import { Disclosure, Menu, Transition } from "@headlessui/react"
import { EllipsisVerticalIcon, ChevronDownIcon } from "@heroicons/react/20/solid"

import { Link, useLocation, useNavigate } from "react-router-dom"
import { DashboardProject } from "../types"
import isManager from "../util/policies"
import CircularProgress from "./CircularProgress"
import DateCellPopover from "./DateCellPopover"
import TaskTableSection from "./tasks/TaskTableSection"
import StatusPopover from "./StatusPopover"
import ResponsiblePopover from "./ResponsiblePopover"
import PriorityPopover from "./PriorityPopover"
import { useUpdateProjectStatus } from "../hooks/useUpdateProjectStatus"
import { useUpdateProjectPriority } from "../hooks/useUpdateProjectPriority"
import { useUpdateProjectResponsible } from "../hooks/useUpdateProjectResponsible"
import { TABLE_GRID } from "../constants/tableColumns"

type ProjectTableRowProps = {
    project: DashboardProject
    user: { _id: string }
}

export default function ProjectTableRow({ project, user }: ProjectTableRowProps) {
    const location = useLocation()
    const navigate = useNavigate()
    const updateProjectStatus = useUpdateProjectStatus()
    const updateProjectPriority = useUpdateProjectPriority()
    const updateProjectResponsible = useUpdateProjectResponsible()

    return (
        <Disclosure as="div" className="border-b border-slate-100 last:border-b-0">
            {({ open }) => (
                <>
                    <div
                        className="grid items-center px-4 py-3 transition-colors hover:bg-brand-primary/5 divide-x divide-slate-100"
                        style={{ gridTemplateColumns: TABLE_GRID }}
                    >
                        <div
                            className="flex items-center gap-2 min-w-0"
                            style={{ gridColumn: '1 / span 2', paddingLeft: 0 }}
                        >
                        <Disclosure.Button className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-200 transition-colors flex-shrink-0">
                            <ChevronDownIcon
                                className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                            />
                        </Disclosure.Button>

                        <div className="flex items-center gap-3 min-w-0">
                            {isManager(project.manager, user._id) ? (
                                <span className="shrink-0 text-[11px] font-semibold uppercase bg-brand-light/10 text-brand-light border border-brand-light/30 rounded-full px-2.5 py-0.5">
                                    Manager
                                </span>
                            ) : (
                                <span className="shrink-0 text-[11px] font-semibold uppercase bg-brand-primary/10 text-brand-primary border border-brand-primary/30 rounded-full px-2.5 py-0.5">
                                    Colaborador
                                </span>
                            )}
                            <Link
                                to={`/projects/${project._id}/details-projects`}
                                className="font-medium text-brand-dark truncate hover:underline text-sm"
                            >
                                {project.projectName}
                            </Link>
                        </div>
                        </div>

                        <div className="flex items-center">
                            <StatusPopover
                                status={project.status}
                                onSelect={(s) => updateProjectStatus.mutate({ projectId: project._id, status: s })}
                                isPending={updateProjectStatus.isPending}
                            />
                        </div>

                        <div className="flex items-center">
                            <ResponsiblePopover
                                projectId={project._id}
                                assignedTo={project.responsible ?? []}
                                onAssign={(userIds) => updateProjectResponsible.mutate({ projectId: project._id, userIds })}
                                isPending={updateProjectResponsible.isPending}
                            />
                        </div>

                        <div className="flex items-center">
                            <PriorityPopover
                                priority={project.priority}
                                onSelect={(p) => updateProjectPriority.mutate({ projectId: project._id, priority: p })}
                            />
                        </div>

                        <div className="flex items-center">
                            <DateCellPopover
                                projectId={project._id}
                                startDate={project.startDate}
                                dueDate={project.dueDate}
                                isOverdue={project.isOverdue}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <CircularProgress percentage={project.progress?.percentage ?? 0} size="sm" />
                            {project.progress && (
                                <span className="text-[11px] text-slate-500 whitespace-nowrap">
                                    {project.progress.completedTasks}/{project.progress.totalTasks}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center justify-center">
                            <Menu as="div" className="relative">
                                <Menu.Button className="block p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-200 transition-colors">
                                    <span className="sr-only">opciones</span>
                                    <EllipsisVerticalIcon className="h-4 w-4" aria-hidden="true" />
                                </Menu.Button>
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="absolute right-0 z-10 mt-1 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                                        <Menu.Item>
                                            <Link
                                                to={`/projects/${project._id}/details-projects`}
                                                className="block px-3 py-1.5 text-sm leading-6 text-gray-900 hover:bg-gray-50"
                                            >
                                                Ver Proyecto
                                            </Link>
                                        </Menu.Item>
                                        {isManager(project.manager, user._id) && (
                                            <>
                                                <Menu.Item>
                                                    <Link
                                                        to={`/projects/${project._id}/edit`}
                                                        className="block px-3 py-1.5 text-sm leading-6 text-gray-900 hover:bg-gray-50"
                                                    >
                                                        Editar Proyecto
                                                    </Link>
                                                </Menu.Item>
                                                <Menu.Item>
                                                    <button
                                                        type="button"
                                                        className="block w-full text-left px-3 py-1.5 text-sm leading-6 text-red-500 hover:bg-gray-50"
                                                        onClick={() => navigate(location.pathname + `?deleteProject=${project._id}`)}
                                                    >
                                                        Eliminar Proyecto
                                                    </button>
                                                </Menu.Item>
                                            </>
                                        )}
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                        </div>
                    </div>

                    <Transition
                        as={Fragment}
                        show={open}
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-y-95 opacity-0"
                        enterTo="transform scale-y-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-y-100 opacity-100"
                        leaveTo="transform scale-y-95 opacity-0"
                    >
                        <Disclosure.Panel static>
                            <TaskTableSection
                                projectId={project._id}
                                canEdit={true}
                                projectStartDate={project.startDate}
                                projectDueDate={project.dueDate}
                            />
                        </Disclosure.Panel>
                    </Transition>
                </>
            )}
        </Disclosure>
    )
}
