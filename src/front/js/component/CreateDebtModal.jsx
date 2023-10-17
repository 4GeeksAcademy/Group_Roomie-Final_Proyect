import React, { useState, useEffect } from "react";

const CreateDebtModal = ({ isOpen, onClose }) => {
  const [roomies, setRoomies] = useState([]);
  const [selectedRoomies, setSelectedRoomies] = useState([]);
  const [expenseName, setExpenseName] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const home_id = localStorage.getItem("home_id");
    // Aquí llamarías a la función getRoomiesByHomeId que obtiene los roomies de la vivienda y los establece en el estado
    // setRoomies(result);
  }, []);

  const handleCancel = () => {
    onClose();
  };

  const handleCreateDebt = () => {
    // Lógica para crear la deuda
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 m-2 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-4">Crear Deuda</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-base md:text-lg lg:text-base mb-2">
            Compartido entre tú y:
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
          >
            {roomies.map((roomie) => (
              <option key={roomie.id} value={roomie.id}>
                {roomie.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-base md:text-lg lg:text-base mb-2">
            Nombre del gasto
          </label>
          <input
            type="text"
            value={expenseName}
            onChange={(e) => setExpenseName(e.target.value)}
            className="border border-gray-300 focus:border-gray-300 rounded-lg p-3 w-full"
          />
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
        <button className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold py-2 px-4 rounded-xl mr-2">
          Adjuntar imagen
        </button>
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
    </div>
  ) : null;
};

export default CreateDebtModal;
