import PlusIcon from "@heroicons/react/20/solid/PlusIcon";
import { NavLink, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();


  return (
    <header className="bg-white border-b border-gray-200 dark:bg-gray-900">
      <nav className="max-w-screen-xl mx-auto p-4">
        <div className="flex justify-end">
          <button
              type="button"
              onClick={() => navigate("/projects/create")}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-primary/90"
            >
              <PlusIcon className="h-4 w-4" />
              Nuevo Proyecto
            </button>
        </div>
        <ul className="flex space-x-4">
          <li>
            {/* <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-700 font-bold underline"
                  : "text-gray-700 hover:text-blue-500"
              }
            >
              Home
            </NavLink> */}
          </li>
          <li>
            {/* <NavLink
              to="/projects/create"
              className={({ isActive }) =>
                isActive
                  ? "text-blue-700 font-bold underline"
                  : "text-gray-700 hover:text-blue-500"
              }
            >
              Nuevo Proyecto
            </NavLink> */}
            
          </li>
        </ul>
      </nav>
    </header>
  );
}
