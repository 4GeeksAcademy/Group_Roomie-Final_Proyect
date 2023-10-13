import React from 'react';

const ModalBuscar = () => {
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-8 pb-8 pt-8 sm:p-6 sm:pb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-600" id="modal-title">
              Busca a un Roomie por su correo electrónico
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Introduce el correo electrónico del Roomie que deseas buscar.
              </p>
            </div>
            <div className="mt-4">
              <input
                type="email"
                className="border border-gray-300 rounded-md w-full p-2"
                placeholder="Correo electrónico"
              />
            </div>
          </div>
         <div className="bg-white px-8 pb-9 sm:p-6 sm:pb-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md bg-orange-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-orange-500 sm:ml-3 sm:w-auto"
            >
              Buscar
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-indigo-100  hover:bg-indigo-200 px-4 py-2 text-sm font-bold text-gray-600 shadow-sm sm:mt-0 sm:w-auto"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalBuscar;
