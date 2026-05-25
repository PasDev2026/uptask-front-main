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
      <div className="mx-auto max-w-3xl">
        <h1 className="text-5xl font-black ">Cambiar Password</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">
          Utiliza este formulario para cambiar tu password
        </p>

        <form
          onSubmit={handleSubmit(handleChangePassword)}
          className=" mt-14 space-y-5 bg-white shadow-lg p-10 rounded-lg"
          noValidate
        >
          <div className="mb-5 space-y-3">
            <label
              className="text-sm uppercase font-bold"
              htmlFor="current_password"
            >
              Password Actual
            </label>
            <div className="relative">
              <input
                id="current_password"
                type={showPasswords.current_password ? "text" : "password"}
                placeholder="Password Actual"
                className="w-full p-3 border border-gray-200 pr-10"
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
              <p>{errors.current_password.message}</p>
            )}
          </div>

          <div className="mb-5 space-y-3">
            <label className="text-sm uppercase font-bold" htmlFor="password">
              Nuevo Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPasswords.password ? "text" : "password"}
                placeholder="Nuevo Password"
                className="w-full p-3 border border-gray-200 pr-10"
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
            {errors.password && <p>{errors.password.message}</p>}
          </div>
          <div className="mb-5 space-y-3">
            <label
              htmlFor="password_confirmation"
              className="text-sm uppercase font-bold"
            >
              Repetir Password
            </label>

            <div className="relative">
              <input
                id="password_confirmation"
                type={showPasswords.password_confirmation ? "text" : "password"}
                placeholder="Repetir Password"
                className="w-full p-3 border border-gray-200 pr-10"
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
              <p>{errors.password_confirmation.message}</p>
            )}
          </div>

          <input
            type="submit"
            value="Cambiar Password"
            className="bg-brand-primary w-full p-3 text-white uppercase font-bold hover:bg-brand-dark cursor-pointer transition-colors"
          />
        </form>
      </div>
    </>
  );
}
