import { NavLink, useNavigate } from "react-router-dom";
import { User } from "../auth/validation";
import { useQueryClient } from "@tanstack/react-query";
import {
  UserCircleIcon,
  FolderIcon,
  UsersIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/20/solid";
import { motion } from "framer-motion";

type SidebarProps = {
  name: User["name"];
  apellido_paterno: User["apellido_paterno"];
  email?: User["email"];
  role?: User["role"];
  area?: User["area"];
};

const stagger = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export default function Sidebar({
  name,
  apellido_paterno,
  email,
  role,
  area,
}: SidebarProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("AUTH_TOKEN");
    queryClient.removeQueries({ queryKey: ["user"] });
    navigate("/auth/login");
  };

  const navLinks = [
    { to: "/profile", label: "Mi perfil", icon: UserCircleIcon },
    { to: "/dashboard", label: "Mis proyectos", icon: FolderIcon },
    ...(role?.name === "admin"
      ? [{ to: "/admin/users", label: "Usuarios", icon: UsersIcon }]
      : []),
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col">

      {/* Logo */}
      <div className="px-6 pt-8 pb-6">
        <a href="/dashboard" className="flex items-center gap-3">
          <img src="/in planner.png" className="h-7 w-auto" alt="InPlanner" />
        </a>
      </div>

      {/* Perfil */}
      <div className="mx-6 my-5 rounded-lg border border-gray-100 bg-gray-50/50 p-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
            {area?.name
              ? area.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
              : name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {name} {apellido_paterno}
            </p>
            {email && (
              <p className="text-xs text-gray-500 truncate">
                {email}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-4 pt-5">
        <motion.ul
          className="space-y-0.5"
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          {navLinks.map(({ to, label, icon: Icon }) => (
            <motion.li key={to} variants={fadeUp}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-brand-primary/10 text-brand-primary font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  }`
                }
              >
                {({ isActive }) => (
                  <div className="flex items-center gap-3 w-full">
                    <Icon
                      className={`h-5 w-5 shrink-0 transition-colors duration-200 ${
                        isActive ? "text-brand-primary" : "text-gray-400"
                      }`}
                    />
                    <span className="flex-1">{label}</span>
                    {isActive && (
                      <span className="text-brand-primary text-sm font-bold leading-none">&gt;</span>
                    )}
                  </div>
                )}
              </NavLink>
            </motion.li>
          ))}
        </motion.ul>
      </nav>

      {/* Cerrar sesión */}
      <div className="px-6 py-5 border-t border-gray-200">
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200"
        >
          <ArrowRightOnRectangleIcon className="h-4 w-4" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
