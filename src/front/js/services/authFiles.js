const getFiles = async (home_id) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_URL}/api/file/home/${home_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("No se pudo obtener la lista de archivos");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener los archivos:", error);
  }
};

const uploadFile = async (name, url, home_id, expense_id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${process.env.REACT_APP_URL}/api/file`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: name,
        url: url,
        home_id: home_id,
        expense_id: expense_id,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al subir el archivo:", error);
  }
};

const authFiles = {
  getFiles,
  uploadFile,
};

export default authFiles;
