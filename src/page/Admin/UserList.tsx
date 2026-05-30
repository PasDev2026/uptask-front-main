import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { KeyIcon, PencilIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid"
import { getAllUsers, updateUserStatus } from "../../api/admin.api";
import Spineer from "../../components/Spineer";
import UserStatusModal from "../../components/UserStatusModal";
import UserEditModal from "../../components/UserEditModal";
import UserCreateModal from "../../components/UserCreateModal";
import ResetPasswordModal from "../../components/ResetPasswordModal";
import { UserAdmin } from "../../auth/validation";

export default function UserList() {

  const queryClient = useQueryClient()
  const [selectedUser, setSelectedUser] = useState<UserAdmin | null>(null)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [resetPasswordUserId, setResetPasswordUserId] = useState<{ id: string; name: string } | null>(null)
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 10
  const offset = (page - 1) * PAGE_SIZE

  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", { offset, limit: PAGE_SIZE }],
    queryFn: () => getAllUsers(offset, PAGE_SIZE),
    retry: false,
  });

  const { mutate } = useMutation({
    mutationFn: ({ userId, estado }: { userId: string; estado: boolean }) =>
      updateUserStatus(userId, estado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
    onError: (error) => {
      console.error(error.message)
    },
  });

  if (isLoading) return <Spineer />;

  if (isError) {
    return (
      <div>
        <h1 className="text-5xl font-black">Usuarios registrados</h1>
        <p className="text-2xl font-light text-red-500 mt-5">
          Error al cargar los usuarios. Verifica tus permisos.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-2">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">Gestión de usuarios</h1>
          <p className="text-sm font-medium text-slate-400 mt-1">
            Administra los roles, áreas y accesos de los usuarios del sistema
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-brand-primary hover:bg-brand-hover text-white text-sm font-bold rounded-lg shadow-sm shadow-brand-primary/10 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shrink-0"
        >
          <svg className="w-4 h-4 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Crear Usuario
        </button>
      </div>

      {data && data.users.length ? (
        <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-brand-primary">
                <tr>
                  <th scope="col" className="px-6 py-2.5 text-left text-[10px] font-extrabold text-white uppercase tracking-wider">
                    Usuario
                  </th>
                  <th scope="col" className="px-6 py-2.5 text-left text-[10px] font-extrabold text-white uppercase tracking-wider">
                    DNI
                  </th>
                  <th scope="col" className="px-6 py-2.5 text-left text-[10px] font-extrabold text-white uppercase tracking-wider">
                    Rol / Área
                  </th>
                  <th scope="col" className="px-6 py-2.5 text-left text-[10px] font-extrabold text-white uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="px-6 py-2.5 text-left text-[10px] font-extrabold text-white uppercase tracking-wider">
                    Sede
                  </th>
                  <th scope="col" className="px-6 py-2.5 text-right text-[10px] font-extrabold text-white uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {data.users.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/40 transition-colors duration-150 group">
                    <td className="px-6 py-2.5 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        {/* Custom minimalist avatar based on name initials (compact 32px) */}
                        <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-xs text-slate-600 shrink-0 select-none group-hover:border-brand-primary/20 group-hover:bg-brand-primary/[0.02] transition-colors duration-150">
                          {user.name.charAt(0).toUpperCase()}
                          {user.apellido_paterno?.charAt(0).toUpperCase() || ""}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-700 truncate group-hover:text-slate-900 transition-colors duration-150">
                            {user.name} {user.apellido_paterno} {user.apellido_materno || ""}
                          </div>
                          <div className="text-[11px] text-slate-400 font-normal truncate mt-0">
                            {user.email} <span className="text-slate-300 mx-0.5 font-light">•</span> @{user.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap">
                      <div className="text-xs text-slate-500 font-medium">{user.dni || "—"}</div>
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap">
                      <div className="text-xs font-bold text-slate-700">
                        {user.role?.name || "Sin rol"}
                      </div>
                      <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                        {user.area?.name
                          ? user.area.name.charAt(0).toUpperCase() + user.area.name.slice(1)
                          : "Sin área"}
                      </div>
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                          user.estado
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-slate-50 text-slate-500 border-slate-100"
                        }`}
                        title="Click para cambiar estado"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${user.estado ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                        {user.estado ? "Activo" : "Inactivo"}
                      </button>
                    </td>
                    <td className="px-6 py-2.5">
                      {user.empresas && user.empresas.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {user.empresas.slice(0, 2).map((e) => (
                            <span key={e._id} className="px-2 py-0.5 text-[9px] rounded bg-slate-50 text-slate-500 border border-slate-100 font-medium whitespace-nowrap">
                              {e.nombre}
                            </span>
                          ))}
                          {user.empresas.length > 2 && (
                            <span
                              className="px-1.5 py-0.5 text-[9px] rounded bg-slate-100 text-slate-500 font-semibold whitespace-nowrap cursor-default"
                              title={user.empresas.slice(2).map((e) => e.nombre).join(", ")}
                            >
                              +{user.empresas.length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-300 font-light">—</span>
                      )}
                    </td>
                    <td className="px-6 py-2.5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setEditingUserId(user._id)}
                          className="p-1 text-slate-400 hover:text-brand-primary hover:bg-slate-50 rounded-lg transition-all duration-200 cursor-pointer"
                          title="Editar usuario"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setResetPasswordUserId({ id: user._id, name: `${user.name} ${user.apellido_paterno}` })}
                          className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-all duration-200 cursor-pointer"
                          title="Restablecer contraseña"
                        >
                          <KeyIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-slate-50/20">
            <p className="text-xs text-slate-400 font-medium">
              Mostrando {offset + 1}–{Math.min(page * PAGE_SIZE, data.total)} de {data.total} usuarios
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                aria-label="Página anterior"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              {Array.from({ length: Math.ceil(data.total / PAGE_SIZE) }, (_, i) => i + 1)
                .reduce<(number | "...")[]>((pages, p, _i, all) => {
                  const first = p === 1;
                  const last = p === all.length;
                  const near = Math.abs(p - page) <= 1;
                  const prevIsEllipsis = pages[pages.length - 1] === "...";
                  if (first || last || near) {
                    pages.push(p);
                  } else if (!prevIsEllipsis) {
                    pages.push("...");
                  }
                  return pages;
                }, [])
                .map((item, i) =>
                  item === "..." ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-xs text-slate-300 select-none">
                      ...
                    </span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setPage(item)}
                      className={`min-w-[28px] h-7 text-xs font-semibold rounded-md transition-all duration-150 cursor-pointer ${
                        item === page
                          ? "bg-brand-primary text-white shadow-sm"
                          : "text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}
              <button
                disabled={page * PAGE_SIZE >= data.total}
                onClick={() => setPage((p) => p + 1)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                aria-label="Página siguiente"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-xl p-12 text-center shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <p className="text-lg font-semibold text-slate-500">
            No hay usuarios registrados aún
          </p>
          <p className="text-sm text-slate-400 mt-1 mb-6">
            Comienza creando el primer usuario del sistema.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-brand-primary hover:bg-brand-hover text-white text-sm font-bold rounded-lg shadow-sm shadow-brand-primary/10 transition-all duration-200 cursor-pointer"
          >
            Crear Usuario
          </button>
        </div>
      )}
      <UserStatusModal
        show={selectedUser !== null}
        userName={selectedUser ? `${selectedUser.name} ${selectedUser.apellido_paterno} ${selectedUser.apellido_materno}` : ""}
        currentStatus={selectedUser?.estado ?? false}
        onConfirm={() => {
          if (selectedUser) {
            mutate({ userId: selectedUser._id, estado: !selectedUser.estado });
            setSelectedUser(null);
          }
        }}
        onClose={() => setSelectedUser(null)}
      />
      <UserEditModal
        isOpen={editingUserId !== null}
        onClose={() => setEditingUserId(null)}
        userId={editingUserId}
      />
      <UserCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      {resetPasswordUserId && (
        <ResetPasswordModal
          userId={resetPasswordUserId.id}
          userName={resetPasswordUserId.name}
          onClose={() => setResetPasswordUserId(null)}
        />
      )}
    </div>
  );
}
