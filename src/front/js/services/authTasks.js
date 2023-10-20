const getTasksByHomeId = async (home_id) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_URL}/api/task/home/${home_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("La respuesta no es válida");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener las tareas:", error);
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

const createNewTask = async (roomie_id, name, date_assigned, date_done) => {
  try {
    const response = await fetch("${process.env.REACT_APP_URL}/api/task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomie_id: roomie_id,
        name: name,
        date_assigned: date_assigned,
        date_done: date_done,
      }),
    });
    if (!response.ok) {
      throw new Error("Error al crear la nueva tarea");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al crear la nueva tarea:", error);
  }
};

const updateTaskDate = async (task_id, new_date_assigned) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_URL}/api/task/${task_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ new_date_assigned: new_date_assigned }),
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

const authTasks = {
  getTasksByHomeId,
  getTaskById,
  createNewTask,
  updateTaskDate,
  markTaskAsDone,
  deleteTask,
};

export default authTasks;
