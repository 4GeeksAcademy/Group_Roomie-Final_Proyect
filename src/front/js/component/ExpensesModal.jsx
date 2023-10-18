import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import useAppContext from "../contexts/AppContext.jsx";

const ExpensesModal = ({ isOpen, onClose, selectedItems }) => {
  const [expenseName, setExpenseName] = useState("");
  const navigate = useNavigate();
  const { actions } = useAppContext();

  const handleCreateExpense = async () => {
    try {
      if (!selectedItems || selectedItems.length === 0) {
        console.error("No se han marcado elementos para el gasto.");
        return;
      }
      const itemIds = selectedItems.map((item) => item.id);
      await actions.createExpense(expenseName, itemIds);
      onClose();
      navigate("/expenses");
    } catch (error) {
      console.error("Error al crear el gasto", error);
    }
  };

  return (
    <>
      {isOpen ? (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4 text-center">
            <div className="fixed inset-0 transition-opacity" onClick={onClose}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="inline-block align-middle bg-white rounded-[50px] text-left overflow-hidden shadow-xl transform transition-all my-8 w-full sm:w-3/4 md:w-1/2 lg:w-1/3"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="p-6 sm:p-8">
                <h2
                  className="text-xl md:text-2xl lg:text-2xl font-bold leading-6 text-gray-700 text-center"
                  id="modal-headline"
                >
                  Crear Gasto
                </h2>
                <form className="mt-4">
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-base md:text-lg lg:text-base mb-2"
                      htmlFor="expenseName"
                    >
                      Nombre del gasto
                    </label>
                    <input
                      type="text"
                      name="expenseName"
                      placeholder="Nombre del gasto"
                      value={expenseName}
                      onChange={(e) => setExpenseName(e.target.value)}
                      className="border border-gray-300 focus:border-gray-300 rounded-lg p-3 w-full"
                    />
                  </div>
                  <div className="text-right mt-4">
                    <button
                      type="button"
                      className="bg-indigo-100 hover:bg-indigo-300 text-gray-600 font-bold py-2 px-4 rounded-xl mr-2"
                      onClick={onClose}
                    >
                      Cerrar
                    </button>
                    <button
                      type="button"
                      className="bg-orange-600 hover-bg-orange-300 text-white font-bold py-2 px-4 rounded-xl"
                      onClick={handleCreateExpense}
                    >
                      Crear
                    </button>
                  </div>
                </form>
              </div>
            </span>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ExpensesModal;
