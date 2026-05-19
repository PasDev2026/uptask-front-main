import { Link } from "react-router-dom";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { useState } from "react";
import { ConfirmToken } from "../validation";
import { useMutation } from "@tanstack/react-query";
import { confirmAccount } from "../../api/auth.api";
import Swal from "sweetalert2";

export default function ConfirmAccount() {
  const [token, setToken] = useState<ConfirmToken["token"]>("");

  const handleChange = (token: ConfirmToken["token"]) => setToken(token);

  const { mutate } = useMutation({
    mutationFn: confirmAccount,
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: error.message,
        text: "Token no válido!",
      });
    },
    onSuccess: (data) => {
      Swal.fire(
        data,
        "Excelente",
        "success"
      );
    },
  });

  const handleComplete = (token: ConfirmToken["token"]) => mutate({token});


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-fuchsia-500 to-purple-800 px-6">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-md p-8">
        {/* Título */}
        <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-800 text-center">
          Confirma tu Cuenta
        </h1>

        {/* Descripción */}
        <p className="text-lg lg:text-2xl font-light text-gray-600 text-center mt-4">
          Ingresa el código que recibiste{" "}
          <span className="text-fuchsia-600 font-bold">por e-mail</span>
        </p>

        {/* Formulario */}
        <form className="space-y-6 mt-6">
          <label
            htmlFor="code"
            className="block text-xl font-medium text-gray-700 text-center"
          >
            Código de 6 dígitos
          </label>
          <div className="flex justify-center gap-5">
            <PinInput
              value={token}
              onChange={handleChange}
              onComplete={handleComplete}
            >
              <PinInputField className="w-10 h-10 p-3 rounded-lg border border-gray-300 placeholder-white" />
              <PinInputField className="w-10 h-10 p-3 rounded-lg border border-gray-300 placeholder-white" />
              <PinInputField className="w-10 h-10 p-3 rounded-lg border border-gray-300 placeholder-white" />
              <PinInputField className="w-10 h-10 p-3 rounded-lg border border-gray-300 placeholder-white" />
              <PinInputField className="w-10 h-10 p-3 rounded-lg border border-gray-300 placeholder-white" />
              <PinInputField className="w-10 h-10 p-3 rounded-lg border border-gray-300 placeholder-white" />
            </PinInput>
          </div>

          {/* Botón de Confirmación */}
          <button
            type="submit"
            className="w-full bg-fuchsia-600 text-white text-lg font-bold py-3 rounded-md hover:bg-fuchsia-700 transition"
          >
            Confirmar Código
          </button>
        </form>

        {/* Navegación */}
        <nav className="mt-6 text-center">
          <Link
            to="/auth/request-new-token"
            className="text-fuchsia-600 hover:underline text-base font-medium"
          >
            Solicitar un nuevo Código
          </Link>
        </nav>
      </div>
    </div>
  );
}
