const getNotificationsForUser = async (userId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/api/blog/user/${userId}/notifications`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Puedes incluir el token de autenticación si es necesario.
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Request failed with status " + response.status);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener las notificaciones:", error);
      return [];
    }
  };
  
  const authBlog = {
    getNotificationsForUser,
  };
  
  export default authBlog;