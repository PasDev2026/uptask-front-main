import { useState } from "react";
import { useForm } from "react-hook-form";
import { UpdateCurrentUserPasswordForm } from "../auth/validation";
import { useMutation } from "@tanstack/react-query";
import { changePasswordPorfile } from "../api/profile.api";
import Swal from "sweetalert2";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";

export default function ChangePasswordProfile() {
  const initialValues: UpdateCurrentUserPasswordForm = {
    current_password: "",
    password: "",
    password_confirmation: "",
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: changePasswordPorfile,
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: error.message,
        text: "El password actual es incorrecto, verifique los datos!",
      });
    },
    onSuccess: (data) => {
      Swal.fire(data.message, " ", "success")
    },
  });

  const [showPasswords, setShowPasswords] = useState({
    current_password: false,
    password: false,
    password_confirmation: false,
  });

  const password = watch("password"); //verificar que los password sean iguales
  const handleChangePassword = (formData: UpdateCurrentUserPasswordForm) => mutate(formData);

  return (
    <>
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-semibold text-gray-900">Cambiar Password</h1>
        <p className="text-sm text-gray-500 mt-1">
          Actualiza tu contraseña
        </p>

        <form
          onSubmit={handleSubmit(handleChangePassword)}
          className="mt-10 space-y-6"
          noValidate
        >
          <div>
            <label
              className="text-sm font-medium text-gray-700"
              htmlFor="current_password"
            >
              Contraseña actual
            </label>
            <div className="relative mt-1">
              <input
                id="current_password"
                type={showPasswords.current_password ? "text" : "password"}
                className="block w-full border border-gray-300 rounded-lg px-3 py-2.5 pr-10 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary focus:outline-none"
                {...register("current_password", {
                  required: "El password actual es obligatorio",
                })}
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    current_password: !prev.current_password,
                  }))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.current_password ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.current_password && (
              <p className="text-xs text-red-500 mt-1">{errors.current_password.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700" htmlFor="password">
              Nueva contraseña
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                type={showPasswords.password ? "text" : "password"}
                className="block w-full border border-gray-300 rounded-lg px-3 py-2.5 pr-10 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary focus:outline-none"
                {...register("password", {
                  required: "El Nuevo Password es obligatorio",
                  minLength: {
                    value: 8,
                    message: "El Password debe ser mínimo de 8 caracteres",
                  },
                })}
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    password: !prev.password,
                  }))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.password ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label
              htmlFor="password_confirmation"
              className="text-sm font-medium text-gray-700"
            >
              Repetir contraseña
            </label>

            <div className="relative mt-1">
              <input
                id="password_confirmation"
                type={showPasswords.password_confirmation ? "text" : "password"}
                className="block w-full border border-gray-300 rounded-lg px-3 py-2.5 pr-10 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary focus:outline-none"
                {...register("password_confirmation", {
                  required: "Este campo es obligatorio",
                  validate: (value) =>
                    value === password || "Los Passwords no son iguales",
                })}
              />
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    password_confirmation: !prev.password_confirmation,
                  }))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.password_confirmation ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password_confirmation && (
              <p className="text-xs text-red-500 mt-1">{errors.password_confirmation.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-dark transition-colors"
          >
            Cambiar Password
          </button>
        </form>
      </div>
    </>
  );
}
