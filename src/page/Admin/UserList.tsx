import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PencilIcon } from "@heroicons/react/20/solid"
import { getAllUsers, updateUserStatus } from "../../api/admin.api";
import Spineer from "../../components/Spineer";
import UserStatusModal from "../../components/UserStatusModal";
import UserEditModal from "../../components/UserEditModal";
import UserCreateModal from "../../components/UserCreateModal";
import { UserAdmin } from "../../auth/validation";

export default function UserList() {

  const queryClient = useQueryClient()
  const [selectedUser, setSelectedUser] = useState<UserAdmin | null>(null)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const { data, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
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
        className="mb-4 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark transition-colors"
      >
        Crear Usuario
      </button>

      {data && data.length ? (
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
              {data.map((user) => (
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500">
                      {user.empresas && user.empresas.length > 0
                        ? user.empresas.map(e => e.nombre).join(', ')
                        : 'Sin asignar'}
                    </span>
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
    </div>
  );
}
