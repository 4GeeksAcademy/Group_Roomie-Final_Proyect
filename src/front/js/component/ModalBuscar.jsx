import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

const ModalBuscar = ({ onClose, onSubmit }) => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleAddRoomie = async () => {
    try {
      await onSubmit(email);
      onClose();
      navigate("/home");
      toast.success("Nuevo roomie añadido a la vivienda", {
        duration: 3000,
      });
    } catch (error) {
      console.error("Error al añadir el roomie:", error);
      toast.error(
        "No es posible añadir este roomie a la vivienda. Revisa los datos introducidos",
        {
          duration: 3000,
        }
      );
    }
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-[50px] p-8 m-2 max-w-md w-full">
            <h2 className="text-2xl font-bold text-center mb-4">
              Añade un nuevo roomie
            </h2>
            <div className="mt-2">
              <input
                type="text"
                placeholder="Correo electrónico del nuevo roomie"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border rounded-xl py-2 px-3 w-full"
              />
            </div>

            <div className="flex justify-end mt-5">
              <button
                onClick={onClose}
                className="bg-orange-600 hover:bg-orange-300 text-white font-bold py-2 px-4 rounded-xl mr-2"
              >
                Cerrar
              </button>
              <button
                onClick={handleAddRoomie}
                className="bg-indigo-100 hover:bg-indigo-300 text-gray-600 font-bold py-2 px-4 rounded-xl"
              >
                Añadir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalBuscar;
