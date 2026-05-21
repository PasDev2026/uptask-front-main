import { NavLink, useNavigate } from "react-router-dom";
import { User } from "../auth/validation";
import { useQueryClient } from "@tanstack/react-query";
import { UserCircleIcon, FolderIcon, UsersIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/20/solid";

type SidebarProps = {
  name: User['name']
  role?: User['role']
}

export default function Sidebar({ name, role }: SidebarProps) {

  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const logout = () => {
    localStorage.removeItem('AUTH_TOKEN')
    queryClient.removeQueries({ queryKey: ['user'] })
    navigate('/auth/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 dark:bg-gray-900 flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 space-y-4">
        <a
          href="https://flowbite.com/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <img
            src="/in planner.png"
            className="h-10"
            alt="Flowbite Logo"
          />
          {/* <span className="self-center text-2xl font-extrabold whitespace-nowrap dark:text-white">
            TODOLIST
          </span> */}
        </a>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary/80 to-brand-primary flex items-center justify-center text-white font-bold text-sm shadow-sm">
            {name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
              {name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Bienvenido de vuelta
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              isActive
                ? "bg-brand-primary text-white font-semibold shadow-sm"
                : "text-gray-700 hover:bg-brand-primary/10 hover:text-brand-primary"
            }`
          }
        >
          <UserCircleIcon className="h-5 w-5" />
          Mi perfil
        </NavLink>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-brand-primary text-white font-semibold shadow-sm"
                    : "text-gray-700 hover:bg-brand-primary/10 hover:text-brand-primary"
                }`
              }
        >
          <FolderIcon className="h-5 w-5" />
          Mis proyectos
        </NavLink>

        {role?.name === 'admin' && (
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive
                    ? "bg-brand-primary text-white font-semibold shadow-sm"
                    : "text-gray-700 hover:bg-brand-primary/10 hover:text-brand-primary"
              }`
            }
          >
            <UsersIcon className="h-5 w-5" />
            Usuarios
          </NavLink>
        )}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 transition-all"
          onClick={logout}
        >
          <ArrowRightOnRectangleIcon className="h-4 w-4" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
