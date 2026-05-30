import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

type UserStatusModalProps = {
  show: boolean;
  userName: string;
  currentStatus: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export default function UserStatusModal({ show, userName, currentStatus, onConfirm, onClose }: UserStatusModalProps) {

  const actionText = currentStatus ? "inactivar" : "activar";
  const actionLabel = currentStatus ? "Inactivar" : "Activar";

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={onClose}
      >
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
                  {actionLabel} usuario
                </Dialog.Title>

                <p className="text-sm text-slate-400 font-medium leading-relaxed">
                  ¿Estás seguro que deseas {actionText} al usuario{" "}
                  <span className="font-bold text-slate-700">{userName}</span>?
                </p>

                <div className="mt-8 flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-slate-500 text-sm font-bold hover:bg-slate-50 active:scale-[0.98] transition-all duration-150 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={onConfirm}
                    className={`flex-1 px-4 py-2.5 rounded-lg text-white text-sm font-bold shadow-sm active:scale-[0.98] transition-all duration-150 cursor-pointer ${
                      currentStatus
                        ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/10"
                        : "bg-brand-primary hover:bg-brand-hover shadow-brand-primary/10"
                    }`}
                  >
                    {actionLabel}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
