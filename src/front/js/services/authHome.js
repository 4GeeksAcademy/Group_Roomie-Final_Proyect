import { useEffect, useState } from "react";
import fetchRoomies from "../services/getRoomies";
import handleCreateHome from "../services/handleCreateHome";

const useAuthHome = (currentUser) => {
  const [roomies, setRoomies] = useState([]);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchRoomies()
      .then((data) => {
        setRoomies(data);
      })
      .catch((error) => {
        setError("Ocurrió un error al obtener la lista de roomies. Por favor, inténtalo de nuevo.");
      });
  }, []);

  const createHome = async () => {
    try {
      const data = await handleCreateHome();
      if (data && data.is_admin) {
        setIsAdmin(true);
      } else if (currentUser) {
        setIsAdmin(currentUser.createdHome);
      }
    } catch (error) {
      setError("Ocurrió un error al crear el Home. Por favor, inténtalo de nuevo.");
    }
  };

  return { roomies, isAdmin, error, createHome };
};

export default useAuthHome;
