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

  // Watch empresas selectively to feed custom SedeInputTag (does not trigger full-modal lags)
  const empresasSelected = watch("empresas") || [];

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

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-7 text-left align-middle shadow-[0_15px_40px_rgba(0,0,0,0.08)] border border-slate-100/60 transition-all">
                {isLoading && (
                  <div className="flex justify-center py-16">
                    <Spineer />
                  </div>
                )}

                {isError && (
                  <div className="text-center py-8">
                    <Dialog.Title as="h3" className="text-lg font-bold mb-2 text-red-500">
                      Error al cargar información
                    </Dialog.Title>
                    <p className="text-sm text-slate-500">{error?.message || "Error al cargar el usuario"}</p>
                    <button
                      onClick={onClose}
                      className="mt-6 px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                    >
                      Cerrar
                    </button>
                  </div>
                )}

                {user && (
                  <>
                    <Dialog.Title as="h3" className="text-xl font-extrabold tracking-tight text-slate-800 mb-6">
                      Editar usuario
                    </Dialog.Title>

                    <form onSubmit={handleSubmit(handleEdit)} noValidate className="space-y-5">
                      <div className="max-h-[60vh] overflow-y-auto pr-1 -mr-1 scrollbar-thin">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-4">
                            {/* Nombre */}
                            <div className="flex flex-col gap-1">
                              <label htmlFor="edit-name" className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1 select-none">
                                Nombre
                              </label>
                              <input
                                id="edit-name"
                                type="text"
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/20 text-slate-700 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:outline-none transition-all duration-150"
                                {...register("name", { required: "El nombre es obligatorio" })}
                              />
                              {errors.name && <p className="text-xs text-red-500 font-semibold mt-1">{errors.name.message}</p>}
                            </div>

                            {/* Apellido Paterno */}
                            <div className="flex flex-col gap-1">
                              <label htmlFor="edit-apellido_paterno" className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1 select-none">
                                Apellido paterno
                              </label>
                              <input
                                id="edit-apellido_paterno"
                                type="text"
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/20 text-slate-700 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:outline-none transition-all duration-150"
                                {...register("apellido_paterno", { required: "El apellido paterno es obligatorio" })}
                              />
                              {errors.apellido_paterno && <p className="text-xs text-red-500 font-semibold mt-1">{errors.apellido_paterno.message}</p>}
                            </div>

                            {/* Apellido Materno */}
                            <div className="flex flex-col gap-1">
                              <label htmlFor="edit-apellido_materno" className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1 select-none">
                                Apellido materno
                              </label>
                              <input
                                id="edit-apellido_materno"
                                type="text"
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/20 text-slate-700 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:outline-none transition-all duration-150"
                                {...register("apellido_materno", { required: "El apellido materno es obligatorio" })}
                              />
                              {errors.apellido_materno && <p className="text-xs text-red-500 font-semibold mt-1">{errors.apellido_materno.message}</p>}
                            </div>

                            {/* DNI */}
                            <div className="flex flex-col gap-1">
                              <label htmlFor="edit-dni" className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1 select-none">
                                DNI (opcional)
                              </label>
                              <input
                                id="edit-dni"
                                type="text"
                                placeholder="Máximo 8 dígitos"
                                className={`w-full px-3 py-2 border rounded-lg text-sm bg-slate-50/20 text-slate-700 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:outline-none transition-all duration-150 ${
                                  dniError || errors.dni ? "border-red-400 focus:ring-red-100 focus:border-red-400" : "border-slate-200"
                                }`}
                                {...register("dni", {
                                  onChange: (e) => {
                                    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 8);
                                  }
                                })}
                              />
                              {errors.dni && <p className="text-xs text-red-500 font-semibold mt-1">{errors.dni.message}</p>}
                              {dniError && <p className="text-xs text-red-500 font-semibold mt-1">{dniError}</p>}
                            </div>

                            {/* Teléfono */}
                            <div className="flex flex-col gap-1">
                              <label htmlFor="edit-telefono" className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1 select-none">
                                Teléfono
                              </label>
                              <input
                                id="edit-telefono"
                                type="tel"
                                placeholder="9 dígitos"
                                className={`w-full px-3 py-2 border rounded-lg text-sm bg-slate-50/20 text-slate-700 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:outline-none transition-all duration-150 ${
                                  errors.telefono ? "border-red-400 focus:ring-red-100 focus:border-red-400" : "border-slate-200"
                                }`}
                                {...register("telefono", {
                                  onChange: (e) => {
                                    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 9);
                                  }
                                })}
                              />
                              {errors.telefono && <p className="text-xs text-red-500 font-semibold mt-1">{errors.telefono.message}</p>}
                            </div>
                          </div>

                          <div className="space-y-4">
                            {/* Email */}
                            <div className="flex flex-col gap-1">
                              <label htmlFor="edit-email" className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1 select-none">
                                Email
                              </label>
                              <input
                                id="edit-email"
                                type="email"
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/20 text-slate-700 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:outline-none transition-all duration-150"
                                {...register("email", {
                                  required: "El email es obligatorio",
                                  pattern: { value: /\S+@\S+\.\S+/, message: "E-mail no válido" },
                                })}
                              />
                              {errors.email && <p className="text-xs text-red-500 font-semibold mt-1">{errors.email.message}</p>}
                            </div>

                            {/* Username */}
                            <div className="flex flex-col gap-1">
                              <label htmlFor="edit-username" className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1 select-none">
                                Username
                              </label>
                              <input
                                id="edit-username"
                                type="text"
                                disabled
                                className="w-full px-3 py-2 border border-slate-100 rounded-lg text-sm bg-slate-50 text-slate-400 select-none cursor-not-allowed"
                                {...register("username")}
                              />
                            </div>

                            {/* Departamento */}
                            <div className="flex flex-col gap-1">
                              <label htmlFor="edit-department" className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1 select-none">
                                Departamento
                              </label>
                              {rolesLoading ? (
                                <div className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-400 select-none">
                                  Cargando roles...
                                </div>
                              ) : rolesError ? (
                                <div className="w-full px-3 py-2 border border-red-200 rounded-lg text-sm bg-red-50 text-red-600">
                                  Error al cargar los roles
                                </div>
                              ) : (
                                <select
                                  id="edit-department"
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-700 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:outline-none transition-all duration-150"
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
                              {errors.department && <p className="text-xs text-red-500 font-semibold mt-1">{errors.department.message}</p>}
                            </div>

                            {/* Área */}
                            <div className="flex flex-col gap-1">
                              <label htmlFor="edit-area" className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1 select-none">
                                Área
                              </label>
                              {areasLoading ? (
                                <div className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-400 select-none">
                                  Cargando áreas...
                                </div>
                              ) : areasError ? (
                                <div className="w-full px-3 py-2 border border-red-200 rounded-lg text-sm bg-red-50 text-red-600">
                                  Error al cargar las áreas
                                </div>
                              ) : (
                                <select
                                  id="edit-area"
                                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-700 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:outline-none transition-all duration-150"
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
                              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1 select-none">
                                Sedes
                              </label>
                              <SedeInputTag
                                value={empresasSelected}
                                onChange={(ids) => setValue("empresas", ids, { shouldValidate: true })}
                                error={errors.empresas?.message}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Botones */}
                      <div className="mt-8 flex gap-3">
                        <button
                          type="button"
                          onClick={onClose}
                          className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-slate-500 text-sm font-bold hover:bg-slate-50 active:scale-[0.98] transition-all duration-150 cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="flex-1 px-4 py-2.5 bg-brand-primary hover:bg-brand-hover text-white text-sm font-bold rounded-lg shadow-sm shadow-brand-primary/10 active:scale-[0.98] transition-all duration-150 cursor-pointer"
                        >
                          Guardar cambios
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
