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

const updateRoomie = (roomieId, password, first_name, last_name) => {
  return fetch(
    `https://laughing-space-goldfish-jxgw66jr5ppc57qx-3001.app.github.dev/api/roomie/${roomieId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: password,
        nombre: first_name,
        apellido: last_name,
      }),
    }
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("La actualización del Roomie falló");
      }
    })
    .catch((error) => {
      console.error("Error en la actualización del Roomie:", error);
    });
};

const getCurrentRoomie = () => {
  return JSON.parse(localStorage.getItem("roomie"));
};

const authProfile = {
  signup,
  login,
  getCurrentRoomie,
  updateRoomie,
};

export default authProfile;
