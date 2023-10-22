import React, { Fragment, useRef, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';

export default function CreateHomeModal({ open, onClose, createHome, isAdmin, homeName }) {
  const cancelButtonRef = useRef();
  const [homeNameInput, setHomeNameInput] = useState("");

  const handleCreateHome = async () => {
    try {
      await createHome(homeNameInput);
      toast.success('El Home se creó exitosamente');
      onClose();
    } catch (error) {
      console.error('Error al crear el Home:', error);
      toast.error('Hubo un error al crear el Home');
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={onClose}>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform px-3 py-4 overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-5 pb-8 pt-6 sm:p-6 sm:pb-4 ">
                  <div className="mb-4">
                  {isAdmin ? (
                      <div>
                        <p>Ya eres administrador del Home:</p>
                        <p className="font-bold text-indigo-600">{homeName}</p>
                      </div>
                    ) : (
                      <>
                        <label className="block text-sm font-medium text-gray-700">Nombre del Home</label>
                        <input
                          type="text"
                          value={homeNameInput}
                          onChange={(e) => setHomeNameInput(e.target.value)}
                          className="mt-1 p-2 w-full border rounded-md shadow-sm"
                        />
                      </>
                    )}
                  </div>
                </div>
                <div className="bg-white px-4 pt-1 pb-5 sm:flex sm:flex-row-reverse sm:px-6">
                  {isAdmin ? (
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-indigo-100 hover-bg-indigo-200 px-4 py-2 text-sm font-bold text-gray-600 shadow-sm sm:mt-0 sm:w-auto"
                      onClick={onClose}
                      ref={cancelButtonRef}
                    >
                      Cerrar
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-bold text-white shadow-sm hover-bg-blue-500 sm:ml-3 sm:w-auto"
                      onClick={handleCreateHome}
                    >
                      Crear Home
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
