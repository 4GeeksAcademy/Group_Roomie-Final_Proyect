export const handleCreateHome = async (homeName) => {
  try {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("roomie_id");
    console.log("Token:", token);
    console.log("User ID:", userId);

    const fetchRoomies = await fetch(`${process.env.REACT_APP_URL}/api/roomie`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (fetchRoomies.ok) {
      const roomies = await fetchRoomies.json();
      const user = roomies.find((roomie) => {
        return Number(userId) === Number(roomie.id);
      });
      console.log("User:", user);

      if (user.home_id !== null) {
        throw new Error('Ya tienes un home asignado.');
      }
    } else {
      const errorMessage = await fetchRoomies.text();
      throw new Error(`Error al verificar el home existente: ${errorMessage}`);
    }

    const createHomeResponse = await fetch(`${process.env.REACT_APP_URL}/api/home`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name: homeName }),
    });

    if (!createHomeResponse.ok) {
      const errorMessage = await createHomeResponse.text();
      throw new Error(`Error al crear el Home: ${errorMessage}`);
    }

    const data = await createHomeResponse.json();
    console.log("Data:", data);

    if (user) {
      user.home_id = data.home_id;
      console.log("User con home_id actualizado:", user);
    }

    return data;
  } catch (error) {
    throw new Error(`Error en la solicitud: ${error.message}`);
  }
};
