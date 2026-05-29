import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { ProjectFormData } from "../../types";
import { useQuery } from "@tanstack/react-query";
import { getSedes } from "../../api/empresa.api";
import { useAuth } from "../../hooks/useAuth";
import { useEffect } from "react";

const inputCls = "w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none";

type Form = {
  register: UseFormRegister<ProjectFormData>;
  errors: FieldErrors<ProjectFormData>;
  setValue?: UseFormSetValue<ProjectFormData>;
  hideEmpresa?: boolean;
};

export default function Form({ errors, register, setValue, hideEmpresa }: Form) {
  const { data: user } = useAuth();
  const { data: sedes } = useQuery({
    queryKey: ["sedes"],
    queryFn: getSedes,
  });

  const userEmpresaIds = user?.empresas?.map(e => e._id) ?? [];
  const sedesFiltradas = sedes?.filter(s => userEmpresaIds.includes(s._id)) ?? [];

  useEffect(() => {
    if (!hideEmpresa && sedesFiltradas.length === 1 && setValue) {
      setValue("empresa", sedesFiltradas[0]._id);
    }
  }, [hideEmpresa, sedesFiltradas, setValue]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="projectName" className="text-sm font-medium text-gray-700">
          Nombre del Proyecto
        </label>
        <input
          id="projectName"
          className={inputCls}
          type="text"
          placeholder="Nombre del Proyecto"
          {...register("projectName", {
            required: "El Titulo del Proyecto es obligatorio",
          })}
        />
        {errors.projectName && (
          <p className="text-sm text-red-600">{errors.projectName.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          id="description"
          className={inputCls}
          placeholder="Descripción del Proyecto"
          rows={3}
          {...register("description", {
            required: "Una descripción del proyecto es obligatoria",
          })}
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {!hideEmpresa && sedesFiltradas.length > 1 && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="empresa" className="text-sm font-medium text-gray-700">
            Sede
          </label>
          <select
            id="empresa"
            className={inputCls}
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
            <p className="text-sm text-red-600">{errors.empresa.message}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="startDate" className="text-sm font-medium text-gray-700">
            Fecha Inicio
          </label>
          <input
            id="startDate"
            className={inputCls}
            type="date"
            {...register("startDate", { setValueAs: (v) => (v === "" ? null : v) })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="dueDate" className="text-sm font-medium text-gray-700">
            Fecha Límite
          </label>
          <input
            id="dueDate"
            className={inputCls}
            type="date"
            {...register("dueDate", { setValueAs: (v) => (v === "" ? null : v) })}
          />
        </div>
      </div>
    </div>
  );
}
