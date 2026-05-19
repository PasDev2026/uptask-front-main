import type { ConfirmToken, NewPasswordForm } from "../../auth/validation";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { updatePasswordWithToken } from "../../api/auth.api";
import Swal from "sweetalert2";
//import ErrorMessage from "@/components/ErrorMessage";

type NewPasswordFormularioProps = {
    token: ConfirmToken['token'],
}

export default function NewPasswordFormulario({token} : NewPasswordFormularioProps) {
    const navigate = useNavigate()
  
    
    const initialValues: NewPasswordForm = {
        password: '',
        password_confirmation: '',
    }
    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({ defaultValues: initialValues });
   
    const {mutate} = useMutation({
        mutationFn: updatePasswordWithToken,
        onError: (error) => {
            Swal.fire({
              icon: "error",
              title: error.message,
              text: "Ocurrió un error, verifique los datos!",
            });
          },
          onSuccess: (data) => {
            Swal.fire(data, "Todo bien", "success");
            reset() //<- reinicia el formulario
            navigate('/auth/login')
          },
    })
    

    const handleNewPassword = (formData: NewPasswordForm) => {
        //mutando la respuesta, tenemos que pasar el password y modificar el token
        const data ={
            formData,
            token
        }
        mutate(data)
    }
    

    const password = watch('password');

    return (
        <>
            <form
                onSubmit={handleSubmit(handleNewPassword)}
                className="space-y-8 p-10  bg-white mt-10"
                noValidate
            >

                <div className="flex flex-col gap-5">
                    <label
                        className="font-normal text-2xl"
                    >Password</label>

                    <input
                        type="password"
                        placeholder="Password de Registro"
                        className="w-full p-3  border-gray-300 border"
                        {...register("password", {
                            required: "El Password es obligatorio",
                            minLength: {
                                value: 8,
                                message: 'El Password debe ser mínimo de 8 caracteres'
                            }
                        })}
                    />
                    {errors.password && (
                        <p>{errors.password.message}</p>
                    )}
                </div>

                <div className="flex flex-col gap-5">
                    <label
                        className="font-normal text-2xl"
                    >Repetir Password</label>

                    <input
                        id="password_confirmation"
                        type="password"
                        placeholder="Repite Password de Registro"
                        className="w-full p-3  border-gray-300 border"
                        {...register("password_confirmation", {
                            required: "Repetir Password es obligatorio",
                            validate: value => value === password || 'Los Passwords no son iguales'
                        })}
                    />

                    {errors.password_confirmation && (
                        <p>{errors.password_confirmation.message}</p>
                    )}
                </div>

                <input
                    type="submit"
                    value='Establecer Password'
                    className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
                />
            </form>
        </>
    )
}