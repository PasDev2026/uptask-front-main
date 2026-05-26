import { useForm } from "react-hook-form";
import { User, UserProfileForm } from "../../auth/validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../../api/profile.api";
import Swal from "sweetalert2";

type ProfileFormProps = {
  data: User;
};

export default function ProfileForm({ data }: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: data });

  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: updateProfile,
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: error.message,
        text: "Ocurrió un error, verifique los datos!",
      });
    },
    onSuccess: (data) => {
      Swal.fire(data.message, " ", "success");
      queryClient.invalidateQueries({queryKey:['user']}) //<- useAuth
    }
  })

  const handleEditProfile = (formData: UserProfileForm) => {
    mutate(formData);
  }

  return (
    <>
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-semibold text-gray-900">Mi Perfil</h1>
        <p className="text-sm text-gray-500 mt-1">
          Actualiza tu información personal
        </p>

        <form
          onSubmit={handleSubmit(handleEditProfile)}
          className="mt-10 space-y-6"
          noValidate
        >
          <div>
            <label className="text-sm font-medium text-gray-700" htmlFor="name">
              Nombre
            </label>
            <input
              id="name"
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary focus:outline-none"
              {...register("name", {
                required: "Nombre de usuario es obligatorio",
              })}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              DNI
            </label>
            <input
              type="text"
              value={data.dni || 'No registrado'}
              className="mt-1 block w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-500 bg-gray-50"
              disabled
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700" htmlFor="email">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary focus:outline-none"
              {...register("email", {
                required: "EL e-mail es obligatorio",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "E-mail no válido",
                },
              })}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-dark transition-colors"
          >
            Guardar Cambios
          </button>
        </form>
      </div>
    </>
  );
}
