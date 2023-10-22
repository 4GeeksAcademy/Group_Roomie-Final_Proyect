import React, { useState, useEffect } from "react";

import useAppContext from "../contexts/AppContext.jsx";

const CreateTaskModal = ({ onClose, handleTaskUpdate }) => {
  const { actions } = useAppContext();
  const [name, setName] = useState("");
  const [dateAssigned, setDateAssigned] = useState("");
  const [selectedRoomie, setSelectedRoomie] = useState("");
  const [roomies, setRoomies] = useState([]);
  const home_id = localStorage.getItem("home_id");

  useEffect(() => {
    const fetchRoomies = async () => {
      try {
        const response = await actions.getRoomiesByHomeId(
          localStorage.getItem("home_id")
        );
        if (response) {
          setRoomies(response);
        }
      } catch (error) {
        console.error("Error al obtener los roomies:", error);
      }
    };
    fetchRoomies();
  }, [actions]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (name && dateAssigned && selectedRoomie) {
      try {
        await actions.createNewTask(selectedRoomie, name, dateAssigned);
        onClose();
        handleTaskUpdate();
      } catch (error) {
        console.error("Error al crear la tarea:", error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-[50px] p-8 m-2 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-4">Nueva Tarea</h2>
        <div className="mt-2">
          <form onSubmit={handleCreateTask}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-base md:text-lg lg:text-base mb-2"
                htmlFor="name"
              >
                Nombre de la Tarea
              </label>
              <input
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Nombre de la tarea"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-base md:text-lg lg:text-base mb-2"
                htmlFor="dateAssigned"
              >
                Asignar Fecha
              </label>
              <input
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="dateAssigned"
                type="date"
                value={dateAssigned}
                onChange={(e) => setDateAssigned(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-base md:text-lg lg:text-base mb-2"
                htmlFor="roomie"
              >
                Asignar Roomie
              </label>
              <select
                value={selectedRoomie}
                onChange={(e) => setSelectedRoomie(e.target.value)}
                className="border border-gray-300 focus:border-gray-300 rounded-lg p-3 w-full"
              >
                {roomies.map((roomie) => (
                  <option key={roomie.id} value={roomie.id}>
                    {roomie.first_name}{" "}
                    {roomie.last_name ? roomie.last_name : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end mt-5">
              <button
                className="bg-indigo-100 hover:bg-indigo-300 text-gray-600 font-bold py-2 px-4 rounded-xl mr-2"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                className="bg-orange-600 hover:bg-orange-300 text-white font-bold py-2 px-4 rounded-xl"
                type="submit"
              >
                Crear Tarea
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
