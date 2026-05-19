import { FieldErrors, UseFormRegister } from "react-hook-form";
import ErrorMsg from "../../components/ErrorMsg";
import { ProjectFormData } from "../../types";

type Form = {
  register: UseFormRegister<ProjectFormData>;
  errors: FieldErrors<ProjectFormData>;
};

export default function Form({ errors, register }: Form) {
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
