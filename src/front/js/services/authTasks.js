const getTasksByHomeId = async (home_id, onlyPendingTasks) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_URL}/api/task/home/${home_id}?only_pending_tasks=${onlyPendingTasks}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener las tareas por ID de vivienda:", error);
    throw error;
  }
};

const getTaskById = async (task_id) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_URL}/api/task/${task_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Error al obtener la tarea por ID");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener la tarea por ID:", error);
  }
};

const createNewTask = async (roomie_id, name, date_assigned) => {
  try {
    const formattedDate = formatDate(date_assigned);
    const response = await fetch(`${process.env.REACT_APP_URL}/api/task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomie_id: roomie_id,
        name: name,
        date_assigned: formattedDate,
      }),
    });
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error al crear la nueva tarea: ${errorMessage}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al crear la nueva tarea:", error);
    throw error;
  }
};

const updateTaskDate = async (task_id, new_date_assigned) => {
  try {
    const formattedDate = formatDate(new_date_assigned);
    const response = await fetch(
      `${process.env.REACT_APP_URL}/api/task/date/${task_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ new_date_assigned: formattedDate }),
      }
    );
    if (!response.ok) {
      throw new Error("Error al actualizar la fecha de la tarea");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al actualizar la fecha de la tarea:", error);
  }
};

const markTaskAsDone = async (task_id) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_URL}/api/task/${task_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Error al marcar la tarea como completada");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al marcar la tarea como completada:", error);
  }
};

const deleteTask = async (task_id) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_URL}/api/task/${task_id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Error al eliminar la tarea");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al eliminar la tarea:", error);
  }
};

const getTasksbyRoomieId = async (roomie_id, onlyPendingTasks) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_URL}/api/task/roomie/${roomie_id}?only_pending_tasks=${onlyPendingTasks}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Error al obtener la tarea por ID");
    }
    return response.json();
  } catch (error) {
    console.error("Error al obtener las tareas:", error);
  }
};

const formatDate = (inputDate) => {
  const dateObj = new Date(inputDate);
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();

  return `${day}-${month}-${year}`;
};

const authTasks = {
  getTasksByHomeId,
  getTaskById,
  createNewTask,
  updateTaskDate,
  markTaskAsDone,
  deleteTask,
  getTasksbyRoomieId,
};

export default authTasks;
