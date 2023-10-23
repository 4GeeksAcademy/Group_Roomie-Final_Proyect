import React, { useState, useEffect } from "react";
import useAppContext from "../contexts/AppContext.jsx";
import CreateTaskModal from "../component/CreateTaskModal.jsx";

const Task = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateAssignedMap, setDateAssignedMap] = useState({});
  const home_id = localStorage.getItem("home_id");
  const { actions } = useAppContext();

  useEffect(() => {
    const fetchTasksAndRoomieNames = async () => {
      try {
        const fetchedTasks = await actions.getTasksByHomeId(home_id, true);
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error al cargar tareas y nombres de roomies:", error);
      }
    };
    fetchTasksAndRoomieNames();
  }, [actions, home_id]);

  const handleTaskUpdate = async () => {
    try {
      const updatedTasks = await actions.getTasksByHomeId(home_id, true);
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

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white rounded-[50px] p-8 max-h-70vh w-full sm:w-3/4 md:w-3/5 lg:w-3/7 xl:w-3/7 overflow-y-auto">
        <h2 className="text-2xl font-bold text-center mb-6">Lista de tareas</h2>
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex flex-col sm:flex-row items-center justify-between border-b pb-2"
            >
              <div className="mb-4 sm:mb-0 sm:mr-4">
                <p className="text-gray-800">Tarea: {task.name}</p>
                <p className="text-gray-600">
                  Fecha asignada: {formatDate(task.date_assigned)}
                </p>
                <p className="text-gray-600">
                  Asignada a: {task.roomie.first_name}
                </p>
                <div className="flex items-center pt-1">
                  <button
                    className="bg-indigo-300 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-xl mr-2 mb-2 sm:mb-0 sm:mr-2"
                    onClick={() => handleDateUpdate(task.id)}
                  >
                    Modificar Fecha
                  </button>
                  <input
                    className="shadow appearance-none border rounded-lg py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                  className="bg-green-300 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-xl mr-2 mb-2 sm:mb-0 sm:mr-2"
                  onClick={() => handleTaskComplete(task.id)}
                >
                  Completada
                </button>
                <button
                  className="bg-red-300 hover:bg-red-500 text-gray-600 font-bold py-2 px-4 rounded-xl mb-2 sm:mb-0"
                  onClick={() => handleTaskDelete(task.id)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex justify-end mt-6">
          <button
            className="bg-orange-600 hover:bg-orange-300 text-white font-bold py-2 px-4 rounded-xl"
            onClick={toggleModal}
          >
            Crear Nueva Tarea
          </button>
        </div>
      </div>
      {isModalOpen && (
        <CreateTaskModal
          onClose={toggleModal}
          handleTaskUpdate={handleTaskUpdate}
        />
      )}
    </div>
  );
};

export default Task;
