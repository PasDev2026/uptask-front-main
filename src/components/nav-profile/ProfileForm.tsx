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
      Swal.fire(data, "Perfil actualizado correctamente :)", "success");
      queryClient.invalidateQueries({queryKey:['user']}) //<- useAuth
    }
  })

  const handleEditProfile = (formData: UserProfileForm) => {
    mutate(formData);
  }

  return (
    <>
      <div className="mx-auto max-w-3xl g">
        <h1 className="text-5xl font-black ">Mi Perfil</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">
          Aquí puedes actualizar tu información
        </p>

        <form
          onSubmit={handleSubmit(handleEditProfile)}
          className=" mt-14 space-y-5  bg-white shadow-lg p-10 rounded-l"
          noValidate
        >
          <div className="mb-5 space-y-3">
            <label className="text-sm uppercase font-bold" htmlFor="name">
              Nombre
            </label>
            <input
              id="name"
              type="text"
              placeholder="Tu Nombre"
              className="w-full p-3  border border-gray-200"
              {...register("name", {
                required: "Nombre de usuario es obligatoro",
              })}
            />
            {errors.name && <p>{errors.name.message}</p>}
          </div>

          <div className="mb-5 space-y-3">
            <label className="text-sm uppercase font-bold">
              DNI
            </label>
            <input
              type="text"
              value={data.dni || 'No registrado'}
              className="w-full p-3 border border-gray-200 bg-gray-50"
              disabled
            />
          </div>

          <div className="mb-5 space-y-3">
            <label className="text-sm uppercase font-bold" htmlFor="password">
              E-mail
            </label>
            <input
              id="text"
              type="email"
              placeholder="Tu Email"
              className="w-full p-3  border border-gray-200"
              {...register("email", {
                required: "EL e-mail es obligatorio",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "E-mail no válido",
                },
              })}
            />
            {errors.email && <p>{errors.email.message}</p>}
          </div>
          <input
            type="submit"
            value="Guardar Cambios"
            className="bg-brand-primary w-full p-3 text-white uppercase font-bold hover:bg-brand-dark cursor-pointer transition-colors"
          />
        </form>
      </div>
    </>
  );
}
