import { useForm } from "react-hook-form";
import { UserRegistrationForm } from "../validation";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createAccount } from "../../api/auth.api";
import Swal from "sweetalert2";

export default function Register() {
   const navigate = useNavigate()
  const initialValues: UserRegistrationForm = {name: "", apellido_paterno: "", apellido_materno: "", telefono: "", email: "", username: "", department: undefined as any, password: "",password_confirmation: "",};

  const { register,handleSubmit,reset,watch,setValue,formState: { errors }} = useForm<UserRegistrationForm>({ defaultValues: initialValues });

  const {mutate} = useMutation({
    mutationFn: createAccount,
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: error.message,
        text: "Ocurrió un error, verifique los datos!",
      });
    },
    onSuccess: (data) => {
      Swal.fire(data?.data, 'Te hemos enviado un correo electronico, revia tu email para confirmar tu cuenta', 'success');
      reset()
      navigate('/auth/confirm-account')
    }
  })

  const password = watch("password");

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 9);
    setValue("telefono", value, { shouldValidate: true });
  };

  const handleRegister = (formData: UserRegistrationForm) => {
    if (!/^\d{1,9}$/.test(formData.telefono)) {
      Swal.fire("Error", "El teléfono debe contener solo números (máximo 9 dígitos)", "error")
      return
    }
    mutate(formData)
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(handleRegister)}
        className="space-y-6 p-8 bg-white shadow-lg rounded-lg max-w-md mx-auto mt-10"
        noValidate
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center">
          Crea tu cuenta
        </h2>
        <p className="text-gray-600 text-center">
          Regístrate para comenzar a administrar tus proyectos
        </p>

        {/* Campo Email */}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="font-medium text-gray-700 text-lg">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            placeholder="Escribe tu correo"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-fuchsia-500 focus:outline-none"
            {...register("email", {
              required: "El correo electrónico es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        {/* Campo Username */}
        <div className="flex flex-col gap-2">
          <label htmlFor="username" className="font-medium text-gray-700 text-lg">
            Nombre de usuario
          </label>
          <input
            id="username"
            type="text"
            placeholder="Elige un username"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-fuchsia-500 focus:outline-none"
            {...register("username", {
              required: "El username es obligatorio",
              minLength: {
                value: 3,
                message: "Debe tener al menos 3 caracteres",
              },
            })}
          />
          {errors.username && (
            <p className="text-sm text-red-600">{errors.username.message}</p>
          )}
        </div>
        {/* Campo Departamento */}
        <div className="flex flex-col gap-2">
          <label htmlFor="department" className="font-medium text-gray-700 text-lg">
            Departamento
          </label>

          <select
            id="department"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-fuchsia-500 focus:outline-none"
            {...register("department", {
              required: "El departamento es obligatorio",
            })}
          >
            <option value="">-- Selecciona un departamento --</option>
            <option value="contabilidad">Contabilidad</option>
            <option value="finanzas">Finanzas</option>
            <option value="tesoreria">Tesorería</option>
            <option value="talentos">Talentos</option>
            <option value="operaciones">Operaciones</option>
          </select>

          {errors.department && (
            <p className="text-sm text-red-600">
              {errors.department.message}
            </p>
          )}
        </div>

        {/* Campo Nombre */}
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="font-medium text-gray-700 text-lg">
            Nombre completo
          </label>
          <input
            id="name"
            type="text"
            placeholder="Escribe tu nombre"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-fuchsia-500 focus:outline-none"
            {...register("name", {
              required: "El nombre es obligatorioi",
            })}
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Campo Apellido Paterno */}
        <div className="flex flex-col gap-2">
          <label htmlFor="apellido_paterno" className="font-medium text-gray-700 text-lg">
            Apellido paterno
          </label>
          <input
            id="apellido_paterno"
            type="text"
            placeholder="Escribe tu apellido paterno"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-fuchsia-500 focus:outline-none"
            {...register("apellido_paterno", {
              required: "El apellido paterno es obligatorio",
            })}
          />
          {errors.apellido_paterno && (
            <p className="text-sm text-red-600">{errors.apellido_paterno?.message}</p>
          )}
        </div>

        {/* Campo Apellido Materno */}
        <div className="flex flex-col gap-2">
          <label htmlFor="apellido_materno" className="font-medium text-gray-700 text-lg">
            Apellido materno
          </label>
          <input
            id="apellido_materno"
            type="text"
            placeholder="Escribe tu apellido materno"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-fuchsia-500 focus:outline-none"
            {...register("apellido_materno", {
              required: "El apellido materno es obligatorio",
            })}
          />
          {errors.apellido_materno && (
            <p className="text-sm text-red-600">{errors.apellido_materno?.message}</p>
          )}
        </div>

        {/* Campo Teléfono */}
        <div className="flex flex-col gap-2">
          <label htmlFor="telefono" className="font-medium text-gray-700 text-lg">
            Teléfono
          </label>
          <input
            id="telefono"
            type="tel"
            placeholder="Máximo 9 dígitos"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-fuchsia-500 focus:outline-none"
            value={watch("telefono") || ""}
            onChange={handlePhoneInput}
          />
          {errors.telefono && (
            <p className="text-sm text-red-600">{errors.telefono?.message}</p>
          )}
        </div>

        {/* Campo Password */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="password"
            className="font-medium text-gray-700 text-lg"
          >
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            placeholder="Crea una contraseña"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-fuchsia-500 focus:outline-none"
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: {
                value: 8,
                message: "La contraseña debe tener al menos 8 caracteres",
              },
            })}
          />
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Campo Repetir Password */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="password_confirmation"
            className="font-medium text-gray-700 text-lg"
          >
            Repite la contraseña
          </label>
          <input
            id="password_confirmation"
            type="password"
            placeholder="Confirma tu contraseña"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-fuchsia-500 focus:outline-none"
            {...register("password_confirmation", {
              required: "Es obligatorio confirmar la contraseña",
              validate: (value) =>
                value === password || "Las contraseñas no coinciden",
            })}
          />
          {errors.password_confirmation && (
            <p className="text-sm text-red-600">
              {errors.password_confirmation.message}
            </p>
          )}
        </div>

        {/* Botón de registro */}
        <input
          type="submit"
          value="Registrarme"
          className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white font-bold text-lg rounded-md cursor-pointer transition"
        />

        <p className="text-gray-500 text-sm text-center mt-4">
          ¿Ya tienes una cuenta?{" "}
          <Link
            to="/auth/login"
            className="text-fuchsia-600 hover:underline font-medium"
          >
            Inicia sesión aquí
          </Link>
        </p>
        <p className="text-gray-500 text-sm text-center mt-8">
        ¿Olvidastetu contraseña? 
        <Link to={"/auth/change-password"} className="text-blue-600 hover:underline">
          Reestablecer
        </Link>
      </p>
      </form>
    </>
  );
}
