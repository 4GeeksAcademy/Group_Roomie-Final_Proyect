import React, { createContext, useContext, useState, useEffect } from "react";

import authProfile from "../services/authProfile";
import authShop from "../services/authShop";

import toast from "react-hot-toast";
import authExpenses from "../services/authExpenses";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const token = localStorage.getItem("token");
  const roomie_id = localStorage.getItem("roomie_id");
  const is_admin = localStorage.getItem("is_admin");
  const home_id = localStorage.getItem("home_id");
  const [authenticated, setAuthenticated] = useState(false);
  const [roomieData, setRoomieData] = useState({});

  useEffect(() => {
    if (token && token !== "" && token !== undefined) {
      setAuthenticated(true);
      getRoomieData();
    }
  }, [token]);

  const login = async (email, password, navigate) => {
    try {
      const response = await authProfile.login(email, password);
      localStorage.setItem("token", response.token);
      localStorage.setItem("roomie_id", response.roomie_id);
      localStorage.setItem("is_admin", response.is_admin);
      localStorage.setItem("home_id", response.home_id);
      setAuthenticated(true);
      navigate("/home");
    } catch (error) {
      console.error("El inicio de sesión falló: ", error);
      toast.error("Algo ha fallado. Comprueba que tus datos sean correctos.", {
        duration: 4000,
      });
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("roomie_id");
      localStorage.removeItem("is_admin");
      localStorage.removeItem("home_id");
      setAuthenticated(false);
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

  const getRoomieData = async () => {
    try {
      const profile_data = await authProfile.getRoomieData(roomie_id);
      setRoomieData(profile_data);
    } catch (error) {
      console.error("Error al obtener los datos del Roomie:", error);
    }
  };

  const updateRoomieData = async (roomieData) => {
    if (!roomie_id) {
      console.error("No se encontró el ID del Roomie");
      return;
    }
    try {
      const updatedData = await authProfile.updateRoomie(
        roomie_id,
        roomieData.first_name,
        roomieData.last_name,
        roomieData.password,
        roomieData.paypal_id,
        roomieData.avatar
      );
      setRoomieData({
        ...roomieData,
        first_name: updatedData.first_name || roomieData.first_name,
        last_name: updatedData.last_name || roomieData.last_name,
        password: updatedData.password || roomieData.password,
        paypal_id: updatedData.paypal_id || roomieData.paypal_id,
        avatar: updatedData.avatar || roomieData.avatar,
      });
      console.log("Datos del Roomie actualizados:", updatedData);
      toast.success("Datos actualizados correctamente", {
        duration: 5000,
      });
    } catch (error) {
      console.error("Error al actualizar datos del Roomie:", error);
    }
  };

  const getShopList = async () => {
    try {
      const response = await authShop.getShopList(home_id);
      return response;
    } catch (error) {
      console.error("Error obteniendo la lista de la compra", error);
      return null;
    }
  };

  const getAllItems = async (list_id) => {
    try {
      const response = await authShop.getAllItems(list_id);
      if (response == undefined) {
        return [];
      } else {
        return response;
      }
    } catch (error) {
      console.error(
        "Error al obtener los elementos de la lista de la compra",
        error
      );
      return null;
    }
  };

  const createNewItem = async (name, shopping_list_id) => {
    try {
      const response = await authShop.createNewItem(name, shopping_list_id);
      return response;
    } catch (error) {
      console.error("Error al añadir nuevo item:", error);
      return null;
    }
  };

  const deleteItem = async (item_id) => {
    try {
      const response = await authShop.deleteItem(item_id);
      if (response && response.message === "Elemento eliminado correctamente") {
        return response;
      } else {
        throw new Error(response.error || "Error al eliminar el item");
      }
    } catch (error) {
      console.error("Error al eliminar el item:", error.message);
      throw error;
    }
  };

  const createExpense = async (expense_name, item_ids) => {
    try {
      const response = await authExpenses.createExpense(expense_name, item_ids);
      return response;
    } catch (error) {
      console.error("Ha habido un error al crear el gasto:", error.message);
      throw error;
    }
  };

  const getExpensesByHomeId = async (home_id) => {
    try {
      const response = await authExpenses.getExpensesByHomeId(home_id);
      return response;
    } catch (error) {
      console.error("Error al obtener los gastos por home_id:", error);
      return null;
    }
  };

  const store = {
    token,
    roomie_id,
    is_admin,
    home_id,
    roomieData,
    authenticated,
  };
  const actions = {
    login,
    signup,
    logout,
    getRoomieData,
    updateRoomieData,
    getShopList,
    getAllItems,
    createNewItem,
    deleteItem,
    createExpense,
    getExpensesByHomeId,
  };

  return (
    <AppContext.Provider value={{ store, actions }}>
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => useContext(AppContext);

export default useAppContext;
