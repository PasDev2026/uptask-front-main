import { FieldErrors, UseFormRegister } from "react-hook-form"
import { TaskFormData } from "../../types"
import { priorityTranslation, PRIORITY_VALUES } from "../../traductor/es"

type TaskFormProps = {
    errors: FieldErrors<TaskFormData>
    register: UseFormRegister<TaskFormData>
    showDates?: boolean
}

export default function TaskForm({errors, register, showDates = false} : TaskFormProps) {
    return (
        <>
            <div className="flex flex-col gap-5">
                <label
                    className="font-normal text-2xl"
                    htmlFor="name"
                >Nombre de la tarea</label>
                <input
                    id="name"
                    type="text"
                    placeholder="Nombre de la tarea"
                    className="w-full p-3  border-gray-300 border"
                    {...register("name", {
                        required: "El nombre de la tarea es obligatorio",
                    })}
                />
                {errors.name && (
                    <p>{errors.name.message}</p>
                )}
            </div>

            <div className="flex flex-col gap-5">
                <label
                    className="font-normal text-2xl"
                    htmlFor="description"
                >Descripción de la tarea</label>
                <textarea
                    id="description"
                    placeholder="Descripción de la tarea"
                    className="w-full p-3  border-gray-300 border"
                    {...register("description", {
                        required: "La descripción de la tarea es obligatoria"
                    })}
                />
                {errors.description && (
                    <p>{errors.description.message}</p>
                )}  
            </div>

            <div className="flex flex-col gap-5">
                <label
                    className="font-normal text-2xl"
                    htmlFor="priority"
                >Prioridad</label>
                <select
                    id="priority"
                    className="w-full p-3 border-gray-300 border"
                    {...register("priority")}
                >
                    {PRIORITY_VALUES.map((p) => (
                        <option key={p} value={p}>
                            {priorityTranslation[p]}
                        </option>
                    ))}
                </select>
            </div>

            {showDates && (
                <>
                    <div className="flex flex-col gap-5">
                        <label className="font-normal text-2xl" htmlFor="startDate">
                            Fecha de inicio
                        </label>
                        <input
                            id="startDate"
                            type="date"
                            className="w-full p-3 border-gray-300 border"
                            {...register("startDate")}
                        />
                        {errors.startDate && (
                            <p>{errors.startDate.message}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-5">
                        <label className="font-normal text-2xl" htmlFor="dueDate">
                            Fecha límite
                        </label>
                        <input
                            id="dueDate"
                            type="date"
                            className="w-full p-3 border-gray-300 border"
                            {...register("dueDate")}
                        />
                        {errors.dueDate && (
                            <p>{errors.dueDate.message}</p>
                        )}
                    </div>
                </>
            )}
        </>
    )
}