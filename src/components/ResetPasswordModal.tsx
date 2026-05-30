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
  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordForm>();

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: ResetPasswordForm) => resetUserPassword(userId, formData.password),
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Ocurrió un error al restablecer la contraseña",
      });
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Contraseña restablecida",
        text: `La contraseña de ${userName} fue restablecida correctamente`,
        confirmButtonColor: "#2DAAA5",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onClose();
    },
  });

  const onSubmit = (formData: ResetPasswordForm) => mutate(formData);

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-7 text-left align-middle shadow-[0_15px_40px_rgba(0,0,0,0.08)] border border-slate-100/60 transition-all">
                <Dialog.Title as="h3" className="text-xl font-extrabold tracking-tight text-slate-800 mb-2">
                  Restablecer contraseña
                </Dialog.Title>

                <p className="text-sm text-slate-400 mb-6 font-medium">
                  Nueva contraseña para <span className="font-bold text-slate-700">{userName}</span>
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1 select-none">
                      Nueva contraseña
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/20 text-slate-700 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:outline-none transition-all duration-150"
                      {...register("password", {
                        required: "La contraseña es obligatoria",
                        minLength: { value: 8, message: "Debe tener al menos 8 caracteres" },
                      })}
                    />
                    {errors.password && (
                      <p className="text-xs text-red-500 font-semibold mt-1">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1 select-none">
                      Confirmar contraseña
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50/20 text-slate-700 focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary focus:outline-none transition-all duration-150"
                      {...register("password_confirmation", {
                        required: "Confirma la contraseña",
                        validate: (value, formValues) => value === formValues.password || "Las contraseñas no coinciden",
                      })}
                    />
                    {errors.password_confirmation && (
                      <p className="text-xs text-red-500 font-semibold mt-1">{errors.password_confirmation.message}</p>
                    )}
                  </div>

                  <div className="mt-8 flex gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isPending}
                      className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-slate-500 text-sm font-bold hover:bg-slate-50 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="flex-1 px-4 py-2.5 bg-brand-primary hover:bg-brand-hover text-white text-sm font-bold rounded-lg shadow-sm shadow-brand-primary/10 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
