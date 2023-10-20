import React, { useState, useEffect } from "react";

import useAppContext from "../contexts/AppContext.jsx";

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { actions } = useAppContext();

  useEffect(() => {
    const fetchTasks = async () => {
      const home_id = localStorage.getItem("home_id");
      const fetchedTasks = await actions.getTasksByHomeId(home_id);
      setTasks(fetchedTasks);
    };
    fetchTasks();
  }, []);

  const handleDateUpdate = (taskId) => {
    // Lógica para actualizar la fecha de la tarea
  };

  const handleTaskComplete = (taskId) => {
    // Lógica para marcar la tarea como completada
  };

  const handleTaskDelete = (taskId) => {
    // Lógica para eliminar la tarea
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-[50px] p-8 w-full md:w-3/4 lg:w-2/4 xl:w-1/4">
        <h2 className="text-2xl font-bold text-center mb-6">Lista de tareas</h2>
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between border-b pb-2"
            >
              <div>
                <p className="text-gray-800">{task.name}</p>
                <p className="text-gray-600">Asignado: {task.date_assigned}</p>
                <p className="text-gray-600">Completado: {task.date_done}</p>
              </div>
              <div>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleDateUpdate(task.id)}
                >
                  Modificar Fecha
                </button>
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleTaskComplete(task.id)}
                >
                  Marcar como Completada
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleTaskDelete(task.id)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex justify-center mt-6">
          <button
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            onClick={toggleModal}
          >
            Crear Nueva Tarea
          </button>
        </div>
      </div>
      {isModalOpen && <Modal onClose={toggleModal} />}
    </div>
  );
};

export default Task;
