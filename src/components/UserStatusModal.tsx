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
        className="relative z-10"
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-2xl font-black mb-4">
                  {actionLabel} usuario
                </Dialog.Title>

                <p className="text-lg text-gray-600">
                  ¿Estás seguro que deseas {actionText} al usuario{" "}
                  <span className="font-bold text-gray-900">{userName}</span>?
                </p>

                <div className="mt-8 flex gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={onConfirm}
                    className={`flex-1 px-4 py-3 rounded-lg text-white font-medium transition-colors ${
                      currentStatus
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
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
