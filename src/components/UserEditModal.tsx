import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userEditSchema, UserEditForm, UpdateUserProfilePayload, Role, Area } from "../auth/validation";
import { getUserById } from "../api/admin.api";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { updateUserProfileApi, getRoles, getAreas } from "../api/admin.api";
import SedeInputTag from "./SedeInputTag";
import Swal from "sweetalert2";
import Spineer from "./Spineer";

type UserEditModalProps = {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
};

export default function UserEditModal({ isOpen, onClose, userId }: UserEditModalProps) {
  const queryClient = useQueryClient();
  const [dniError, setDniError] = useState<string | null>(null);

  // Fetch user data when modal opens
  const { data: user, isLoading, isError, error } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId!),
    enabled: isOpen && !!userId,
  });

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<UserEditForm>({
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      name: "",
      apellido_paterno: "",
      apellido_materno: "",
      telefono: "",
      dni: "",
      email: "",
      username: "",
      empresas: [],
      department: "",
      area: "",
    },
  });

  // Reset form when user data arrives
  useEffect(() => {
    if (user && isOpen) {
      reset({
        name: user.name,
        apellido_paterno: user.apellido_paterno,
        apellido_materno: user.apellido_materno,
        telefono: user.telefono,
        dni: user.dni || "",
        email: user.email,
        username: user.username,
        empresas: user.empresas?.map(e => e._id) || [],
        department: user.role?._id || user.department || "",
        area: user.area?._id || "",
      });
    }
  }, [user, isOpen, reset]);

  const { data: roles, isLoading: rolesLoading, isError: rolesError } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
    enabled: isOpen,
  });

  const { data: areas, isLoading: areasLoading, isError: areasError } = useQuery({
    queryKey: ["areas"],
    queryFn: getAreas,
    enabled: isOpen,
  });

  const { mutate } = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateUserProfilePayload }) =>
      updateUserProfileApi(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      Swal.fire("¡Actualizado!", "Los datos del usuario han sido actualizados correctamente", "success");
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
    setValue("telefono", value, { shouldValidate: true });
  };

  const handleDniInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 8);
    setValue("dni", value, { shouldValidate: true });
  };

  const handleEdit = (formData: UserEditForm) => {
    if (user) {
      const { department, dni, empresas, area, ...rest } = formData;
      const payload: UpdateUserProfilePayload = { 
        ...rest, 
        role: department
      };
      
      // Include DNI only if not empty
      if (dni && dni.trim() !== "") {
        payload.dni = dni.trim();
      }

      // Include empresas only if not empty
      if (empresas && empresas.length > 0) {
        payload.empresas = empresas;
      }

      // Include area only if not empty
      if (area) {
        payload.area = area;
      }
      
      mutate({ 
        userId: user._id, 
        data: payload
      });
    }
  };

  // Loading state
  if (isLoading) {
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
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                  <div className="flex justify-center">
                    <Spineer />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  }

  // Error state
  if (isError) {
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
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-2xl font-black mb-4 text-red-600">
                    Error
                  </Dialog.Title>
                  <p className="text-gray-600">{error?.message || "Error al cargar el usuario"}</p>
                  <button
                    onClick={onClose}
                    className="mt-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Cerrar
                  </button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  }

  if (!user) return null;

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
                  Editar usuario
                </Dialog.Title>

                <form onSubmit={handleSubmit(handleEdit)} noValidate>
                  <div className="max-h-[65vh] overflow-y-auto -mr-2 pr-2">
                    <div className="grid grid-cols-2 gap-x-6">
                      <div className="space-y-4">
                        {/* Nombre */}
                        <div className="flex flex-col gap-1">
                          <label htmlFor="edit-name" className="font-medium text-gray-700">
                            Nombre
                          </label>
                          <input
                            id="edit-name"
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none"
                            {...register("name", { required: "El nombre es obligatorio" })}
                          />
                          {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
                        </div>

                        {/* Apellido Paterno */}
                        <div className="flex flex-col gap-1">
                          <label htmlFor="edit-apellido_paterno" className="font-medium text-gray-700">
                            Apellido paterno
                          </label>
                          <input
                            id="edit-apellido_paterno"
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none"
                            {...register("apellido_paterno", { required: "El apellido paterno es obligatorio" })}
                          />
                          {errors.apellido_paterno && <p className="text-sm text-red-600">{errors.apellido_paterno.message}</p>}
                        </div>

                        {/* Apellido Materno */}
                        <div className="flex flex-col gap-1">
                          <label htmlFor="edit-apellido_materno" className="font-medium text-gray-700">
                            Apellido materno
                          </label>
                          <input
                            id="edit-apellido_materno"
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none"
                            {...register("apellido_materno", { required: "El apellido materno es obligatorio" })}
                          />
                          {errors.apellido_materno && <p className="text-sm text-red-600">{errors.apellido_materno.message}</p>}
                        </div>

                        {/* DNI */}
                        <div className="flex flex-col gap-1">
                          <label htmlFor="edit-dni" className="font-medium text-gray-700">
                            DNI (opcional)
                          </label>
                          <input
                            id="edit-dni"
                            type="text"
                            placeholder="Documento Nacional de Identidad (máximo 8 dígitos)"
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
                          <label htmlFor="edit-telefono" className="font-medium text-gray-700">
                            Teléfono
                          </label>
                          <input
                            id="edit-telefono"
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
                        {/* Email */}
                        <div className="flex flex-col gap-1">
                          <label htmlFor="edit-email" className="font-medium text-gray-700">
                            Email
                          </label>
                          <input
                            id="edit-email"
                            type="email"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none"
                            {...register("email", {
                              required: "El email es obligatorio",
                              pattern: { value: /\S+@\S+\.\S+/, message: "E-mail no válido" },
                            })}
                          />
                          {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                        </div>

                        {/* Username */}
                        <div className="flex flex-col gap-1">
                          <label htmlFor="edit-username" className="font-medium text-gray-700">
                            Username
                          </label>
                          <input
                            id="edit-username"
                            type="text"
                            disabled
                            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                            {...register("username")}
                          />
                        </div>

                        

                         {/* Departamento */}
                         <div className="flex flex-col gap-1">
                           <label htmlFor="edit-department" className="font-medium text-gray-700">
                             Departamento
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
                               id="edit-department"
                               className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none"
                               {...register("department", { required: "El departamento es obligatorio" })}
                             >
                               <option value="">-- Selecciona --</option>
                               {roles?.map((role: Role) => (
                                 <option key={role._id} value={role._id}>
                                   {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                                 </option>
                               ))}
                             </select>
                           )}
                            {errors.department && <p className="text-sm text-red-600">{errors.department.message}</p>}
                          </div>

                          {/* Área */}
                          <div className="flex flex-col gap-1">
                            <label htmlFor="edit-area" className="font-medium text-gray-700">
                              Área
                            </label>
                            {areasLoading ? (
                              <div className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                                Cargando áreas...
                              </div>
                            ) : areasError ? (
                              <div className="w-full p-2 border border-red-300 rounded-md bg-red-50 text-red-600 text-sm">
                                Error al cargar las áreas
                              </div>
                            ) : (
                              <select
                                id="edit-area"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none"
                                {...register("area")}
                              >
                                <option value="">-- Selecciona --</option>
                                {areas?.map((area: Area) => (
                                  <option key={area._id} value={area._id}>
                                    {area.name.charAt(0).toUpperCase() + area.name.slice(1)}
                                  </option>
                                ))}
                              </select>
                            )}
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
                       </div>
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="mt-6 flex gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-brand-primary hover:bg-brand-secondary text-white font-medium rounded-lg transition-colors"
                    >
                      Guardar cambios
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
