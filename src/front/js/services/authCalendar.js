const fetchCalendarData = async (roomie_id) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_URL}/api/calendar/${roomie_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Error al obtener los datos del calendario");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en la solicitud de datos del calendario:", error);
    return null;
  }
};

const authCalendar = {
  fetchCalendarData,
};

export default authCalendar;
