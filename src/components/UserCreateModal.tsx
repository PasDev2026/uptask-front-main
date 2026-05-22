import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userCreateSchema, UserCreateForm, Role } from "../auth/validation";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { createUserByAdmin, getRoles } from "../api/admin.api";
import SedeInputTag from "./SedeInputTag";
import Swal from "sweetalert2";

type UserCreateModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function UserCreateModal({ isOpen, onClose }: UserCreateModalProps) {
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const [dniError, setDniError] = useState<string | null>(null);

  const { data: roles, isLoading: rolesLoading, isError: rolesError } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
    enabled: isOpen,
  });

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<UserCreateForm>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      name: "",
      apellido_paterno: "",
      apellido_materno: "",
      telefono: "",
      dni: "",
      username: "",
      email: "",
      password: "",
      empresas: [],
      role: "",
    },
  });

  const { mutate } = useMutation({
    mutationFn: (data: UserCreateForm) => createUserByAdmin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      Swal.fire("¡Creado!", "El usuario ha sido creado correctamente", "success");
      reset();
      setDniError(null);
      onClose();
    },
    onError: (error) => {
      if (error.message.includes("DNI ya está en uso")) {
        setDniError("El DNI ya está en uso");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message,
        });
      }
    },
  });

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 9);
    const { onChange } = register("telefono");
    onChange({
      target: {
        name: "telefono",
        value: value,
      },
      type: "change",
    });
  };

  const handleDniInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 8);
    const { onChange } = register("dni");
    onChange({
      target: {
        name: "dni",
        value: value,
      },
      type: "change",
    });
  };

  const handleCreate = (formData: UserCreateForm) => {
    const payload: UserCreateForm = { ...formData };
    
    if (!payload.email) {
      delete payload.email;
    }
    if (!payload.role) {
      delete payload.role;
    }

    mutate(payload);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-2xl font-black mb-6">
                  Crear usuario
                </Dialog.Title>

                <form onSubmit={handleSubmit(handleCreate)} noValidate>
                  <div className="max-h-[65vh] overflow-y-auto -mr-2 pr-2">
                    <div className="grid grid-cols-2 gap-x-6">
                      <div className="space-y-4">
                        {/* Nombre */}
                        <div className="flex flex-col gap-1">
                          <label htmlFor="create-name" className="font-medium text-gray-700">
                            Nombre
                          </label>
                          <input
                            id="create-name"
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none"
                            {...register("name")}
                          />
                          {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                        </div>

                        {/* Apellido Paterno */}
                        <div className="flex flex-col gap-1">
                          <label htmlFor="create-apellido_paterno" className="font-medium text-gray-700">
                            Apellido paterno
                          </label>
                          <input
                            id="create-apellido_paterno"
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none"
                            {...register("apellido_paterno")}
                          />
                          {errors.apellido_paterno && <p className="text-sm text-red-600">{errors.apellido_paterno.message}</p>}
                        </div>

                        {/* Apellido Materno */}
                        <div className="flex flex-col gap-1">
                          <label htmlFor="create-apellido_materno" className="font-medium text-gray-700">
                            Apellido materno
                          </label>
                          <input
                            id="create-apellido_materno"
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none"
                            {...register("apellido_materno")}
                          />
                          {errors.apellido_materno && <p className="text-sm text-red-600">{errors.apellido_materno.message}</p>}
                        </div>

                        {/* DNI */}
                        <div className="flex flex-col gap-1">
                          <label htmlFor="create-dni" className="font-medium text-gray-700">
                            DNI
                          </label>
                          <input
                            id="create-dni"
                            type="text"
                            placeholder="Documento Nacional de Identidad"
                            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none ${
                              dniError ? "border-red-500" : "border-gray-300"
                            }`}
                            value={watch("dni") || ""}
                            onChange={handleDniInput}
                          />
                          {errors.dni && <p className="text-sm text-red-600">{errors.dni.message}</p>}
                          {dniError && <p className="text-sm text-red-600">{dniError}</p>}
                        </div>

                        {/* Teléfono */}
                        <div className="flex flex-col gap-1">
                          <label htmlFor="create-telefono" className="font-medium text-gray-700">
                            Teléfono
                          </label>
                          <input
                            id="create-telefono"
                            type="tel"
                            placeholder="Máximo 9 dígitos"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none"
                            value={watch("telefono") || ""}
                            onChange={handlePhoneInput}
                          />
                          {errors.telefono && <p className="text-sm text-red-600">{errors.telefono.message}</p>}
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Username */}
                        <div className="flex flex-col gap-1">
                          <label htmlFor="create-username" className="font-medium text-gray-700">
                            Username
                          </label>
                          <input
                            id="create-username"
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none"
                            {...register("username")}
                          />
                          {errors.username && <p className="text-sm text-red-600">{errors.username.message}</p>}
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-1">
                          <label htmlFor="create-email" className="font-medium text-gray-700">
                            Email
                          </label>
                          <input
                            id="create-email"
                            type="email"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none"
                            {...register("email")}
                          />
                          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                        </div>

                        {/* Contraseña */}
                        <div className="flex flex-col gap-1">
                          <label htmlFor="create-password" className="font-medium text-gray-700">
                            Contraseña
                          </label>
                          <div className="relative">
                            <input
                              id="create-password"
                              type={showPassword ? "text" : "password"}
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none pr-10"
                              {...register("password")}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-600 hover:text-gray-800"
                            >
                              {showPassword ? "Ocultar" : "Mostrar"}
                            </button>
                          </div>
                          {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
                        </div>

                        {/* Sedes */}
                        <div className="flex flex-col gap-1">
                          <label className="font-medium text-gray-700">
                            Sedes
                          </label>
                          <SedeInputTag
                            value={watch("empresas") || []}
                            onChange={(ids) => setValue("empresas", ids, { shouldValidate: true })}
                            error={errors.empresas?.message}
                          />
                        </div>

                        {/* Rol */}
                        <div className="flex flex-col gap-1">
                          <label htmlFor="create-role" className="font-medium text-gray-700">
                            Rol
                          </label>
                          {rolesLoading ? (
                            <div className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                              Cargando roles...
                            </div>
                          ) : rolesError ? (
                            <div className="w-full p-2 border border-red-300 rounded-md bg-red-50 text-red-600 text-sm">
                              Error al cargar los roles
                            </div>
                          ) : (
                            <select
                              id="create-role"
                              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none"
                              {...register("role")}
                            >
                              <option value="">-- Seleccione una opcion --</option>
                              {roles?.map((role: Role) => (
                                <option key={role._id} value={role._id}>
                                  {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 px-4 py-3 bg-brand-primary hover:bg-brand-dark text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Creando..." : "Crear usuario"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
