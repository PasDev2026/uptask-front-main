
//import ErrorMessage from "@/components/ErrorMessage";

import { useState } from "react"
import NewPasswordToken from "../../components/auth/NewPasswordToken";
import NewPasswordFormulario from "../../components/auth/NewPasswordFormulario";
import { ConfirmToken } from "../validation";

//Formulario Para reestablecer una nueva contraseña
export default function NewPassword() {
  
  const [token, setToken] = useState<ConfirmToken['token']>('')
  const [isValueToken, setIsValidToken] = useState(false)
 
  

  return (
    <>
        <h2 className="text-3xl font-bold text-gray-800 text-center">
          Escribe tu nuevo Password
        </h2>
        
        {
          !isValueToken ? <NewPasswordToken token= {token} setToken={setToken} setIsValidToken={setIsValidToken} /> 
          : <NewPasswordFormulario token = {token} />
        }
    </>
  )
}