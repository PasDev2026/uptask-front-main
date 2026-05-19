import { useForm } from "react-hook-form";
import { UserLoginForm } from "../validation";
import { useNavigate } from "react-router-dom";
import { authenticate } from "../../api/auth.api";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";



export default function Login() {

  const initialValues: UserLoginForm = {username: '',password: ''}
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues })
  const navigate = useNavigate()
  
  const {mutate} = useMutation({
    mutationFn: authenticate,
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: error.message,
        text: "Hubo un error, verifique los datos! O la cuenta no ha sido confirmada",
      });
    },
    onSuccess: (data) => {
      console.log(data);
      //Swal.fire(data, "Bienvenido", "success");
      navigate('/dashboard')
    },
  })

  const handleLogin = (formData: UserLoginForm) => { 
    mutate(formData)
  }  
  return (
    <>
        <h2 className="text-3xl font-bold text-gray-800 text-center">
          Inicia Sesión
        </h2>
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="space-y-8 p-10 bg-white"
        noValidate
      >
        <div className="flex flex-col gap-5">
          <label
            className="font-normal text-2xl"
          >Usuario</label>

          <input
            id="username"
            type="text"
            placeholder="Ingresa tu usuario"
            className="w-full p-3  border-gray-300 border"
            {...register("username", {
              required: "El nombre de usuario es obligatorio",
            })}
          />
          {errors.username && (
            <p>{errors.username.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <label
            className="font-normal text-2xl"
          >Contraseña</label>

          <input
            type="password"
            placeholder="Ingresa tu contraseña"
            className="w-full p-3  border-gray-300 border"
            {...register("password", {
              required: "El Password es obligatorio",
            })}
          />
          {errors.password && (
            <p>{errors.password.message}</p>
          )}
        </div>

        <input
          type="submit"
          value='Iniciar Sesión'
          className="w-full p-3 text-white font-bold text-xl cursor-pointer rounded-full transition-colors duration-300"
          style={{
            backgroundColor: '#2DAAA5',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#248f8a'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2DAAA5'}
        />
      </form>

     {/*  <p className="text-gray-500 text-sm text-center mt-8">
        ¿No tienes una cuenta?{" "}
        <Link to={"/auth/register"} className="text-blue-600 hover:underline">
          Regístrate aquí
        </Link>
      </p>
      <p className="text-gray-500 text-sm text-center mt-8">
        ¿Olvidaste tu contraseña? 
        <Link to={"/auth/change-password"} className="text-blue-600 hover:underline">
          Reestablecer
        </Link>
      </p> */}
    </>
  )
}