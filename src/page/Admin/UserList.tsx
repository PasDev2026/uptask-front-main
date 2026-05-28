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
    <div>
      <h1 className="text-5xl font-black">Gestion de usuarios</h1>
      <p className="text-2xl font-light text-gray-500 mt-5">
        Lista de todos los usuarios del sistema
      </p>

      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="mb-4 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/80 transition-colors"
      >
        Crear Usuario
      </button>

      {data && data.users.length ? (
        <div className="mt-10 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    DNI
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Área
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Correo
                  </th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sede
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name} {user.apellido_paterno} {user.apellido_materno}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.dni || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.username}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role?.name === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role?.name || 'Sin rol'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {user.area?.name
                        ? user.area.name.charAt(0).toUpperCase() + user.area.name.slice(1)
                        : 'Sin área'}
                    </span>
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.confirmed
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.confirmed ? 'Confirmado' : 'Pendiente'}
                    </span>
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer hover:opacity-80 transition-opacity ${
                        user.estado
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                      title="Click para cambiar estado"
                    >
                      {user.estado ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    {user.empresas && user.empresas.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {user.empresas.slice(0, 2).map(e => (
                          <span key={e._id} className="px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-600 font-medium whitespace-nowrap">
                            {e.nombre}
                          </span>
                        ))}
                        {user.empresas.length > 2 && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-slate-200 text-slate-500 font-semibold whitespace-nowrap">
                            +{user.empresas.length - 2}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Sin asignar</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingUserId(user._id)}
                        className="p-1 text-brand-primary hover:text-brand-dark transition-colors"
                        title="Editar usuario"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setResetPasswordUserId({ id: user._id, name: `${user.name} ${user.apellido_paterno}` })}
                        className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
                        title="Restablecer contraseña"
                      >
                        <KeyIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Mostrando {offset + 1}–{Math.min(page * PAGE_SIZE, data.total)} de {data.total} usuarios
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Página anterior"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              {Array.from({ length: Math.ceil(data.total / PAGE_SIZE) }, (_, i) => i + 1)
                .reduce<(number | '...')[]>((pages, p, _i, all) => {
                  const first = p === 1
                  const last = p === all.length
                  const near = Math.abs(p - page) <= 1
                  const prevIsEllipsis = pages[pages.length - 1] === '...'
                  if (first || last || near) {
                    pages.push(p)
                  } else if (!prevIsEllipsis) {
                    pages.push('...')
                  }
                  return pages
                }, [])
                .map((item, i) =>
                  item === '...' ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-sm text-gray-400 select-none">
                      ...
                    </span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setPage(item)}
                      className={`min-w-[32px] h-8 text-sm font-medium rounded-md transition-colors ${
                        item === page
                          ? 'bg-brand-primary text-white shadow-sm'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}
              <button
                disabled={page * PAGE_SIZE >= data.total}
                onClick={() => setPage((p) => p + 1)}
                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Página siguiente"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-2xl font-light text-gray-500 mt-5">
          No hay usuarios registrados aún
        </p>
      )}
      <UserStatusModal
        show={selectedUser !== null}
        userName={selectedUser ? `${selectedUser.name} ${selectedUser.apellido_paterno} ${selectedUser.apellido_materno}` : ''}
        currentStatus={selectedUser?.estado ?? false}
        onConfirm={() => {
          if (selectedUser) {
            mutate({ userId: selectedUser._id, estado: !selectedUser.estado })
            setSelectedUser(null)
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
