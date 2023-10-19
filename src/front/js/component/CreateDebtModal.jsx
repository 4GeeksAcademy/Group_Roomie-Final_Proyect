import React, { useState, useEffect } from "react";

import useAppContext from "../contexts/AppContext.jsx";
import CloudinaryUpload from "./CloudinaryUpload.jsx";

const CreateDebtModal = ({
  isOpen,
  onClose,
  selectedExpenseId,
  handleCreateDebtUpdate,
}) => {
  const [roomies, setRoomies] = useState([]);
  const [selectedRoomies, setSelectedRoomies] = useState([]);
  const [amount, setAmount] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCloudinaryOpen, setIsCloudinaryOpen] = useState(false);
  const { actions } = useAppContext();

  useEffect(() => {
    const fetchRoomies = async () => {
      try {
        const response = await actions.getRoomiesByHomeId(
          localStorage.getItem("home_id")
        );
        if (response) {
          const currentUserIndex = response.findIndex(
            (roomie) =>
              roomie.id === parseInt(localStorage.getItem("roomie_id"))
          );
          if (currentUserIndex !== -1) {
            response.splice(currentUserIndex, 1);
          }
          setRoomies(response);
        }
      } catch (error) {
        console.error("Error al obtener los roomies:", error);
      }
    };
    fetchRoomies();
  }, [actions]);

  const handleCancel = () => {
    onClose();
  };

  const handleCreateDebt = async () => {
    try {
      const expense_id = selectedExpenseId;
      const debtor_ids = selectedRoomies;
      const total_amount = parseFloat(amount);
      const responseData = await actions.createDebt(
        expense_id,
        debtor_ids,
        total_amount
      );
      handleCreateDebtUpdate();
      onClose();
      // window.location.reload();
    } catch (error) {
      console.error("Error al crear la deuda:", error);
    }
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 m-2 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-4">Crear Deuda</h2>
        <div className="mb-4" style={{ maxHeight: "200px", overflowY: "auto" }}>
          <label className="block text-gray-700 text-base md:text-lg lg:text-base mb-2">
            Compartido entre <strong>tú</strong> y:
          </label>
          <select
            multiple
            value={selectedRoomies}
            onChange={(e) =>
              setSelectedRoomies(
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
            className="border border-gray-300 focus:border-gray-300 rounded-lg p-3 w-full"
            style={{ height: "50px" }}
          >
            {roomies.map((roomie) => (
              <option key={roomie.id} value={roomie.id}>
                {roomie.first_name} {roomie.last_name ? roomie.last_name : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-base md:text-lg lg:text-base mb-2">
            Importe
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border border-gray-300 focus:border-gray-300 rounded-lg p-3 pr-10 w-full"
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-700 pointer-events-none">
              €
            </span>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-base md:text-lg lg:text-base mb-2">
            Fecha
          </label>
          <p className="border border-gray-300 rounded-lg p-3 w-full">
            {formatDate(selectedDate)}
          </p>
        </div>
        <CloudinaryUpload />
        <div className="flex justify-end mt-5">
          <button
            className="bg-indigo-100 hover:bg-indigo-300 text-gray-600 font-bold py-2 px-4 rounded-xl mr-2"
            onClick={handleCancel}
          >
            Cancelar
          </button>
          <button
            className="bg-orange-600 hover:bg-orange-300 text-white font-bold py-2 px-4 rounded-xl"
            onClick={handleCreateDebt}
          >
            Crear
          </button>
        </div>
      </div>
      {isCloudinaryOpen && (
        <CloudinaryUpload onClose={() => setIsCloudinaryOpen(false)} />
      )}
    </div>
  );
};

export default CreateDebtModal;
