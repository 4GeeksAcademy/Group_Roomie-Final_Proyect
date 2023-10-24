const getBlogsByHome = async (home_id) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_URL}/api/blog/home/${home_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Error al obtener las actualizaciones");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener las entradas del blog:", error);
  }
};

const authBlog = {
  getBlogsByHome,
};

export default authBlog;
