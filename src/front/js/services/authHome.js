const createHome = async (name) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${process.env.REACT_APP_URL}/api/home`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: name }),
    });
    if (!response.ok) {
      throw new Error("Error al crear la vivienda");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al crear la vivienda:", error);
  }
};

const addRoomieToHomeByEmail = async (email) => {
  const token = localStorage.getItem("token");
  const home_id = localStorage.getItem("home_id");
  try {
    const response = await fetch(
      `${process.env.REACT_APP_URL}/api/home/${home_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: email,
        }),
      }
    );
    if (!response.ok) {
      throw new Error(
        "Error al agregar al compañero de vivienda por correo electrónico"
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al agregar al compañero de vivienda:", error);
    throw error;
  }
};

const deleteRoomieFromHome = async (home_id, roomie_id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(
      `${process.env.REACT_APP_URL}/api/home/${home_id}/${roomie_id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(
        "Error al eliminar al compañero de vivienda de la vivienda"
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(
      "Error al eliminar al compañero de vivienda de la vivienda:",
      error
    );
  }
};

const desactivateHome = async (home_id) => {
  const token = localStorage.getItem("token");
  console.log(home_id);
  try {
    const response = await fetch(
      `${process.env.REACT_APP_URL}/api/home/${home_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(response);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al desactivar la vivienda:", error);
  }
};

const authHome = {
  createHome,
  addRoomieToHomeByEmail,
  deleteRoomieFromHome,
  desactivateHome,
};
export default authHome;
