import { FieldErrors, UseFormRegister } from "react-hook-form";
import ErrorMsg from "../../components/ErrorMsg";
import { ProjectFormData } from "../../types";
import { useQuery } from "@tanstack/react-query";
import { getSedes } from "../../api/empresa.api";
import { useAuth } from "../../hooks/useAuth";

type Form = {
  register: UseFormRegister<ProjectFormData>;
  errors: FieldErrors<ProjectFormData>;
  hideEmpresa?: boolean;
};

export default function Form({ errors, register, hideEmpresa }: Form) {
  const { data: user } = useAuth();
  const { data: sedes } = useQuery({
    queryKey: ["sedes"],
    queryFn: getSedes,
  });

  const userEmpresaIds = user?.empresas?.map(e => e._id) ?? [];
  const sedesFiltradas = sedes?.filter(s => userEmpresaIds.includes(s._id)) ?? [];

  return (
    <>
      <div className="mb-5 space-y-3">
        <label htmlFor="projectName" className="text-sm uppercase font-bold">
          Nombre del Proyecto
        </label>
        <input
          id="projectName"
          className="w-full p-3  border border-gray-200"
          type="text"
          placeholder="Nombre del Proyecto"
          {...register("projectName", {
            required: "El Titulo del Proyecto es obligatorio",
          })}
        />

        {errors.projectName && (
          <ErrorMsg>{errors.projectName.message}</ErrorMsg>
        )}
      </div>

      <div className="mb-5 space-y-3">
        <label htmlFor="clientName" className="text-sm uppercase font-bold">
          Nombre Cliente
        </label>
        <input
          id="clientName"
          className="w-full p-3  border border-gray-200"
          type="text"
          placeholder="Nombre del Cliente"
          {...register("clientName", {
            required: "El Nombre del Cliente es obligatorio",
          })}
        />

        {errors.clientName && (
          <ErrorMsg>{errors.clientName.message}</ErrorMsg>
        )}
      </div>

      <div className="mb-5 space-y-3">
        <label htmlFor="description" className="text-sm uppercase font-bold">
          Descripción
        </label>
        <textarea
          id="description"
          className="w-full p-3  border border-gray-200"
          placeholder="Descripción del Proyecto"
          {...register("description", {
            required: "Una descripción del proyecto es obligatoria",
          })}
        />

        {errors.description && (
          <ErrorMsg>{errors.description.message}</ErrorMsg>
        )}
      </div>

      {!hideEmpresa && sedesFiltradas.length === 1 && (
        <input type="hidden" {...register("empresa")} value={sedesFiltradas[0]._id} />
      )}

      {!hideEmpresa && sedesFiltradas.length > 1 && (
        <div className="mb-5 space-y-3">
          <label htmlFor="empresa" className="text-sm uppercase font-bold">
            Sede
          </label>
          <select
            id="empresa"
            className="w-full p-3 border border-gray-200"
            {...register("empresa", { required: "La sede es obligatoria" })}
          >
            <option value="">Seleccionar sede</option>
            {sedesFiltradas.map(sede => (
              <option key={sede._id} value={sede._id}>
                {sede.nombre}
              </option>
            ))}
          </select>

          {errors.empresa && (
            <ErrorMsg>{errors.empresa.message}</ErrorMsg>
          )}
        </div>
      )}

      <div className="mb-5 space-y-3">
        <label htmlFor="startDate" className="text-sm uppercase font-bold">
          Fecha Inicio
        </label>
        <input
          id="startDate"
          className="w-full p-3 border border-gray-200"
          type="date"
          {...register("startDate", { setValueAs: (v) => (v === "" ? null : v) })}
        />
      </div>

      <div className="mb-5 space-y-3">
        <label htmlFor="dueDate" className="text-sm uppercase font-bold">
          Fecha Límite
        </label>
        <input
          id="dueDate"
          className="w-full p-3 border border-gray-200"
          type="date"
          {...register("dueDate", { setValueAs: (v) => (v === "" ? null : v) })}
        />
      </div>
    </>
  );
}
