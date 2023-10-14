const signup = (email, password, first_name) => {
  return fetch(
    "https://laughing-space-goldfish-jxgw66jr5ppc57qx-3001.app.github.dev/api/signup",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        first_name: first_name,
      }),
    }
  ).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Network response was not ok");
    }
  });
};

const login = (email, password) => {
  return fetch(
    "https://laughing-space-goldfish-jxgw66jr5ppc57qx-3001.app.github.dev/api/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    }
  ).then((response) => {
    if (response.ok) {
      return response.json().then((data) => {
        if (data.access_token) {
          localStorage.setItem("roomie", JSON.stringify(data));
        }
        return data;
      });
    } else {
      throw new Error("Network response was not ok");
    }
  });
};

const getRoomieData = async (roomie_id) => {
  try {
    const response = await fetch(
      `https://laughing-space-goldfish-jxgw66jr5ppc57qx-3001.app.github.dev/api/roomie/${roomie_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(
        `Error al obtener los datos del roomie: ${response.statusText}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener los datos del Roomie:", error);
    throw error;
  }
};

const updateRoomie = (roomie_id, password, firstName, lastName) => {
  return fetch(
    `https://laughing-space-goldfish-jxgw66jr5ppc57qx-3001.app.github.dev/api/roomie/${roomie_id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: password,
        first_name: firstName,
        last_name: lastName,
      }),
    }
  ).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(`Error al actualizar el roomie: ${errorMessage}`);
    }
  });
};

const getCurrentRoomie = () => {
  return JSON.parse(localStorage.getItem("roomie"));
};

const authProfile = {
  signup,
  login,
  getCurrentRoomie,
  getRoomieData,
  updateRoomie,
};

export default authProfile;
