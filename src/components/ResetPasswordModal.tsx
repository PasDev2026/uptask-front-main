import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { resetUserPassword } from "../api/admin.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

type ResetPasswordModalProps = {
  userId: string;
  userName: string;
  onClose: () => void;
};

type ResetPasswordForm = {
  password: string;
  password_confirmation: string;
};

export default function ResetPasswordModal({ userId, userName, onClose }: ResetPasswordModalProps) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetPasswordForm>();

  const { mutate, isPending } = useMutation({
    mutationFn: () => resetUserPassword(userId, watch('password')),
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: error.message,
        text: "Ocurrió un error al restablecer la contraseña",
      });
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Contraseña restablecida",
        text: `La contraseña de ${userName} fue restablecida correctamente`,
        confirmButtonColor: "#2DAAA5",
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onClose();
    },
  });

  const onSubmit = () => mutate();

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-2xl font-black mb-4">
                  Restablecer contraseña
                </Dialog.Title>

                <p className="text-lg text-gray-600 mb-6">
                  Nueva contraseña para <span className="font-bold text-gray-900">{userName}</span>
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div>
                    <label className="font-medium text-gray-700 block mb-1">Nueva contraseña</label>
                    <input
                      type="password"
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      {...register("password", {
                        required: "La contraseña es obligatoria",
                        minLength: { value: 8, message: "Debe tener al menos 8 caracteres" },
                      })}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="font-medium text-gray-700 block mb-1">Confirmar contraseña</label>
                    <input
                      type="password"
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      {...register("password_confirmation", {
                        required: "Confirma la contraseña",
                        validate: (value) => value === watch('password') || "Las contraseñas no coinciden",
                      })}
                    />
                    {errors.password_confirmation && (
                      <p className="text-red-500 text-sm mt-1">{errors.password_confirmation.message}</p>
                    )}
                  </div>

                  <div className="mt-8 flex gap-4">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isPending}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="flex-1 px-4 py-3 rounded-lg text-white font-medium transition-colors bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {isPending ? "Restableciendo..." : "Restablecer"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
