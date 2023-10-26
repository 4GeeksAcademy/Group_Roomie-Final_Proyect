import React, { useState, useEffect } from "react";

import useAppContext from "../contexts/AppContext.jsx";
import CreateTaskModal from "../component/CreateTaskModal.jsx";
import Loader from "../component/Loader.jsx";

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateAssignedMap, setDateAssignedMap] = useState({});
  const [loading, setLoading] = useState(true);
  const { actions, store } = useAppContext();

  useEffect(() => {
    const fetchTasksAndRoomieNames = async () => {
      try {
        const fetchedTasks = await actions.getTasksByHomeId(
          store.home_id,
          true
        );
        setTasks(fetchedTasks);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar tareas y nombres de roomies:", error);
        setLoading(false);
      }
    };
    fetchTasksAndRoomieNames();
  }, [actions, store.home_id]);

  const handleTaskUpdate = async () => {
    try {
      const updatedTasks = await actions.getTasksByHomeId(store.home_id, true);
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error al actualizar las tareas:", error);
    }
  };

  const handleDateUpdate = async (taskId) => {
    try {
      const newDate = dateAssignedMap[taskId];
      const response = await actions.updateTaskDate(taskId, newDate);
      if (!response) {
        throw new Error("Error al actualizar la fecha de la tarea");
      }
      const updatedTasks = tasks.map((task) =>
        task.id === taskId
          ? { ...task, date_assigned: newDate, date_done: null }
          : task
      );
      setTasks(updatedTasks);
      updateDateAssignedMap(taskId, "");
    } catch (error) {
      console.error("Error al actualizar la fecha de la tarea:", error);
    }
  };

  const updateDateAssignedMap = (taskId, value) => {
    setDateAssignedMap((prevMap) => ({ ...prevMap, [taskId]: value }));
  };

  const handleTaskComplete = async (taskId) => {
    try {
      const response = await actions.markTaskAsDone(taskId);
      if (!response) {
        throw new Error("Error al marcar la tarea como completada");
      }
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error al marcar la tarea como completada:", error);
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      const response = await actions.deleteTask(taskId);
      if (!response) {
        throw new Error("Error al eliminar la tarea");
      }
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  if (store.home_id === "null") {
    return (
      <h1 className="min-h-screen flex items-center justify-center text-center text-2xl font-bold tracking-tight text-gray-600 sm:text-4xl sm:p-4">
        No estás vinculado a ninguna vivienda.
        <br />
        Crea una o pide a un administrador que te añada
      </h1>
    );
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex items-center justify-center mt-5 sm:mt-20 md:mt-20 mx-2">
          <div className="bg-white rounded-[50px] p-4 md:p-8 w-full md:w-3/4 lg:w-3/5 xl:w-3/7">
            <h2 className="text-lg md:text-2xl font-bold text-center mb-4 md:mb-6">
              Lista de tareas
            </h2>
            <ul className="space-y-2 md:space-y-4">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex flex-col sm:flex-row items-center justify-between border-b pb-2"
                >
                  <div className="mb-2 sm:mb-0 sm:mr-4">
                    <p className="text-sm md:text-base text-gray-800">
                      Tarea: {task.name}
                    </p>
                    <p className="text-sm md:text-base text-gray-600">
                      Fecha asignada: {formatDate(task.date_assigned)}
                    </p>
                    <p className="text-sm md:text-base text-gray-600">
                      Asignada a: {task.roomie.first_name}
                    </p>
                    <div className="flex items-center pt-1">
                      <button
                        className="bg-indigo-300 hover:bg-indigo-500 text-white text-xs md:text-sm font-bold py-1 md:py-2 px-2 md:px-4 rounded-xl mr-1 md:mr-2 mb-1 sm:mb-0 sm:mr-2"
                        onClick={() => handleDateUpdate(task.id)}
                      >
                        Modificar Fecha
                      </button>
                      <input
                        className="shadow appearance-none border rounded-lg py-1 md:py-2 px-2 md:px-3 text-xs md:text-sm text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id={`dateAssigned_${task.id}`}
                        type="date"
                        value={dateAssignedMap[task.id] || ""}
                        onChange={(e) =>
                          updateDateAssignedMap(task.id, e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="flex">
                    <button
                      className="bg-green-300 hover:bg-green-500 text-white text-xs md:text-sm font-bold py-1 md:py-2 px-2 md:px-4 rounded-xl mr-1 md:mr-2 mb-1 sm:mb-0 sm:mr-2"
                      onClick={() => handleTaskComplete(task.id)}
                    >
                      Completada
                    </button>
                    <button
                      className="bg-red-300 hover:bg-red-500 text-gray-600 text-xs md:text-sm font-bold py-1 md:py-2 px-2 md:px-4 rounded-xl mb-1 sm:mb-0"
                      onClick={() => handleTaskDelete(task.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex justify-end mt-4 md:mt-6">
              <button
                className="bg-orange-600 hover:bg-orange-300 text-white text-xs md:text-sm font-bold py-1 md:py-2 px-2 md:px-4 rounded-xl"
                onClick={toggleModal}
              >
                Crear Nueva Tarea
              </button>
            </div>
          </div>
        </div>
      )}
      {isModalOpen && (
        <CreateTaskModal
          onClose={toggleModal}
          handleTaskUpdate={handleTaskUpdate}
        />
      )}
    </>
  );
};

export default Task;
