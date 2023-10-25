const signup = (email, password, first_name) => {
    return fetch(
      `${process.env.REACT_APP_URL}/api/signup`,
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
      `${process.env.REACT_APP_URL}/api/login`,
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
        `${process.env.REACT_APP_URL}/api/roomie/${roomie_id}`,
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
  
  const updateRoomie = (
    roomie_id,
    first_name,
    last_name,
    password,
    paypal_id,
    avatar
  ) => {
    const updateData = {};
    if (first_name) updateData.first_name = first_name;
    if (last_name) updateData.last_name = last_name;
    if (password) updateData.password = password;
    if (paypal_id) updateData.paypal_id = paypal_id;
    if (avatar) updateData.avatar = avatar;
    return fetch(
      `${process.env.REACT_APP_URL}/api/roomie/${roomie_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      }
    ).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Error al actualizar el roomie:", response.status);
      }
    });
  };
  
  const getRoomieById = async (roomie_id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/api/roomie/${roomie_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error al obtener el roomie por ID");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener el roomie por ID:", error);
      return null;
    }
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
    getRoomieById,
  };
  
  export default authProfile;