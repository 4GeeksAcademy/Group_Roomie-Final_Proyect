const deleteRoomie = (roomieId) => {
    return fetch(`${process.env.REACT_APP_URL}/api/roomie/${roomieId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, 
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error(`Error al eliminar el roomie: ${response.status}`);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        throw error;
      });
  };

  
  export const roomieServices = {
    deleteRoomie,
  };
  
  export default roomieServices;
  