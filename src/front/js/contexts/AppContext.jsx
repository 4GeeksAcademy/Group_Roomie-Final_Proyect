import React, { createContext, useContext, useState, useEffect } from "react";

import authProfile from "../services/authProfile";

import getRoomies from '../services/getRoomies';

import toast from "react-hot-toast";
import authShop from "../services/authShop";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const token = localStorage.getItem("token");
  const roomieId = localStorage.getItem("roomie_id");
  const [authenticated, setAuthenticated] = useState(false);
  const [roomieData, setRoomieData] = useState(null);
  const [roomies, setRoomies] = useState([]);

  useEffect(() => {
    if (token && token !== "" && token !== undefined) {
      setAuthenticated(true);
    }
  }, [token]);

  useEffect(() => {
    if (authenticated) {
      getRoomies() 
        .then((data) => {
          setRoomies(data);
        })
        .catch((error) => {
          console.error("Error al cargar la lista de roomies: ", error);
        });
    }
  }, [authenticated]);

  const deleteRoomie = async (roomieIdToDelete) => {
    try {
      const response = await fetch(`/api/delete-roomie/${roomieIdToDelete}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`, 
        },
      });

      if (response.status === 204) {
        setRoomies((prevRoomies) =>
          prevRoomies.filter((roomie) => roomie.id !== roomieIdToDelete)
        );
      } else {
        console.error("Error al eliminar el roomie");
      }
    } catch (error) {
      console.error("Error al eliminar el roomie: ", error);
    }
  };

  const login = async (email, password, navigate) => {
    try {
      const response = await authProfile.login(email, password);
      localStorage.setItem("token", response.token);
      localStorage.setItem("roomieId", response.roomie_id);
      localStorage.setItem("isAdmin", response.is_admin);
      setAuthenticated(true);
      navigate("/home");
    } catch (error) {
      console.error("El inicio de sesión falló: ", error);
      toast.error("Algo ha fallado. Comprueba que tus datos sean correctos.", {
        duration: 4000,
      });
    }
  };

  const logout = async (navigate) => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("roomieId");
      localStorage.removeItem("isAdmin");
      setAuthenticated(false);
      navigate("/");
      toast.success("Vuelve pronto, ¡te esperamos!", {
        duration: 5000,
      });
    } catch (error) {
      console.error("Logout failed: ", error);
    }
  };

  const signup = async (email, password, first_name, navigate) => {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!email || !emailRegex.test(email)) {
      console.error("El email no es válido");
      toast.error("El email no tiene el formato correcto", {
        duration: 5000,
      });
      return;
    }
    if (!email || !first_name) {
      console.error("Algún campo no es correcto");
      return;
    }
    if (password.length < 8) {
      console.error("La contraseña debe tener al menos 8 caracteres");
      toast.error("El password debe tener al menos 8 caracteres", {
        duration: 5000,
      });
      return;
    }
    try {
      const response = await authProfile.signup(email, password, first_name);
      if (response) {
        toast.success("¡Registro completado!\nAhora ya puedes entrar", {
          duration: 5000,
        });
        navigate("/");
      } else {
        toast.error(
          "Algún dato no es correcto.\nPor favor, revisa los campos que has introducido",
          {
            duration: 5000,
          }
        );
      }
    } catch (error) {
      console.error("Error al registrar roomie", error);
      toast.error(
        "Algún dato no es correcto.\nPor favor, revisa los campos que has introducido",
        {
          duration: 5000,
        }
      );
    }
  };

  const updateRoomieData = (first_name, last_name, password) => {
    const storedRoomieId = localStorage.getItem("roomieId");
    let roomieId;
    if (storedRoomieId) {
      const parsedRoomieId = JSON.parse(storedRoomieId);
      roomieId = parsedRoomieId.roomieId;
    } else {
      console.error(
        "No se encontró el ID del Roomie en el almacenamiento local"
      );
      return;
    }
    console.log(first_name, last_name, password, roomieId);
    authProfile
      .updateRoomie(roomieId, password, first_name, last_name)
      .then((data) => {
        console.log("Datos del Roomie actualizados:", data);
        toast.success("Datos actualizados correctamente", {
          duration: 5000,
        });
      })
      .catch((error) => {
        console.error("Error al actualizar datos del Roomie:", error);
      });
  };

  const getNameShopList = async (home_id) => {
    try {
      const response = await authShop.getNameShopList(home_id);
      console.log(response);
    } catch (error) {
      console.error(
        "Error obteniendo el nombre de la lista de la compra",
        error
      );
    }
  };

  const store = {
    token,
    roomieId,
  };
  const actions = {
    login,
    signup,
    logout,
    getNameShopList,
    updateRoomieData,
    deleteRoomie,
  };

  return (
    <AppContext.Provider value={{ store, actions }}>
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => useContext(AppContext);

export default useAppContext;
