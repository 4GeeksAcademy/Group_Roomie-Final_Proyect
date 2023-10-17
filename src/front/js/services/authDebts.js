const getRoomiesByHomeId = async (home_id) => {
  try {
    const response = await fetch(
      `https://laughing-space-goldfish-jxgw66jr5ppc57qx-3001.app.github.dev/api/roomie/home/${home_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Request failed with status " + response.status);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener los roomies:", error);
    return null;
  }
};

const authDebts = {
  getRoomiesByHomeId,
};

export default authDebts;
