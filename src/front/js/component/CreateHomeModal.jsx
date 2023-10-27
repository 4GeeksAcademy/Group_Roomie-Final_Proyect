import React, { useState } from "react";

import toast from "react-hot-toast";

const CreateHomeModal = ({ onClose, onSubmit, fetchRoomies }) => {
  const [homeName, setHomeName] = useState("");

  const handleCreateHome = async () => {
    try {
      const response = await onSubmit(homeName);
      if (response && response.access_token) {
        const { access_token, is_admin, home_id } = response;
        const updatedIsAdmin = is_admin === true ? "true" : "false";
        localStorage.setItem("token", access_token);
        localStorage.setItem("is_admin", updatedIsAdmin);
        localStorage.setItem("home_id", home_id);
      }
      window.location.reload();
      fetchRoomies();
      onClose();
      toast.success("Nueva vivienda creada correctamente", {
        duration: 3000,
      });
    } catch (error) {
      console.error("Error al crear el Home:", error);
    }
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[50px] p-8 m-2 max-w-md w-full">
            <h2 className="text-2xl font-bold text-center mb-4">
              Crea una nueva vivienda
            </h2>
            <div className="mt-2">
              <input
                type="text"
                placeholder="Nombre de la vivienda"
                value={homeName}
                onChange={(e) => setHomeName(e.target.value)}
                className="border rounded-xl py-2 px-3 w-full"
              />
            </div>

            <div className="flex justify-end mt-5">
              <button
                onClick={onClose}
                className="bg-indigo-100 hover:bg-indigo-300 text-gray-600 font-bold py-2 px-4 rounded-xl mr-2"
              >
                Cerrar
              </button>
              <button
                onClick={handleCreateHome}
                className="bg-orange-600 hover:bg-orange-300 text-white font-bold py-2 px-4 rounded-xl"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateHomeModal;
