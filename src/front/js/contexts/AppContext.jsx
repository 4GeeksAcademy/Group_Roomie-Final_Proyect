import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

import authProfile from "../services/authProfile";
import authShop from "../services/authShop";
import authExpenses from "../services/authExpenses";
import authDebts from "../services/authDebts";

import toast from "react-hot-toast";
import authFiles from "../services/authFiles";
import authTasks from "../services/authTasks";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const token = localStorage.getItem("token");
  const roomie_id = localStorage.getItem("roomie_id");
  const is_admin = localStorage.getItem("is_admin");
  const home_id = localStorage.getItem("home_id");
  const [authenticated, setAuthenticated] = useState(false);
  const [roomieData, setRoomieData] = useState({});
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  const [filesInfo, setFilesInfo] = useState([]);

  useEffect(() => {
    if (token && token !== "" && token !== undefined) {
      setAuthenticated(true);
      getRoomieData();
    }
  }, [token]);

  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: "dewjikwun",
        uploadPreset: "roomie_connect",
      },
      function (error, result) {
        if (!error && result && result.event === "success") {
          console.log("Listo! Estos son los datos del archivo: ", result.info);
          const file = {
            name: result.info.original_filename,
            url: result.info.url,
          };
          setFilesInfo([...filesInfo, file]);
        }
      }
    );
  }, [filesInfo]);

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
      return profile_data;
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
      console.error("Error al eliminar el item:", error);
      throw error;
    }
  };

  const createExpense = async (expense_name, item_ids) => {
    try {
      const response = await authExpenses.createExpense(expense_name, item_ids);
      return response;
    } catch (error) {
      console.error("Ha habido un error al crear el gasto:", error);
      throw error;
    }
  };

  const getExpensesByRoomieId = async (roomie_id) => {
    try {
      const response = await authExpenses.getExpensesByRoomieId(roomie_id);
      return response;
    } catch (error) {
      console.error("Error al obtener los gastos por roomie_id:", error);
      return null;
    }
  };

  const getRoomiesByHomeId = async (home_id) => {
    try {
      const response = await authDebts.getRoomiesByHomeId(home_id);
      if (!response) {
        throw new Error("Error al obtener los roomies. Respuesta vacía.");
      }
      return response;
    } catch (error) {
      console.error("Error al obtener los roomies:", error);
      throw error;
    }
  };

  const createDebt = async (expense_id, debtor_ids, total_amount) => {
    try {
      const response = await authDebts.createDebt(
        expense_id,
        debtor_ids,
        total_amount
      );
      return response;
    } catch (error) {
      console.error("Error al crear la deuda:", error);
      throw error;
    }
  };

  const getDebtsByRoomieId = async (roomie_id) => {
    try {
      const response = await authDebts.getDebtsByRoomieId(roomie_id);
      return response;
    } catch (error) {
      console.error("Error al obtener las deudas del roomie", error);
      return null;
    }
  };

  const payDebt = async (debt_id) => {
    try {
      const response = await authDebts.payDebt(debt_id);
      return response;
    } catch (error) {
      console.error("Error al realizar el pago de la deuda:", error);
      return null;
    }
  };

  const getRoomieById = async (roomie_id) => {
    try {
      const response = await authProfile.getRoomieById(roomie_id);
      return response;
    } catch (error) {
      console.error("Error al obtener el roomie por ID:", error);
      return null;
    }
  };

  const getFiles = async (home_id) => {
    try {
      const response = await authFiles.getFiles(home_id);
      const data = await response;
      return data;
    } catch (error) {
      console.error("Error al obtener los archivos:", error);
    }
  };

  const uploadFile = async (name, url, home_id, expense_id) => {
    try {
      const response = await authFiles.uploadFile(
        name,
        url,
        home_id,
        expense_id
      );
      const data = await response;
      return data;
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      throw error;
    }
  };

  const getTasksByHomeId = async (home_id) => {
    try {
      const response = await authTasks.getTasksByHomeId(home_id);
      return response;
    } catch (error) {
      console.error("Error al obtener las tareas:", error);
    }
  };

  const getTaskById = async (task_id) => {
    try {
      const response = await authTasks.getTaskById(task_id);
      if (!response.ok) {
        throw new Error("Error al obtener la tarea por ID");
      }
      return response;
    } catch (error) {
      console.error("Ocurrió un error al obtener la tarea por ID:", error);
      return null;
    }
  };

  const createNewTask = async (roomie_id, name, date_assigned, date_done) => {
    try {
      const response = await authTasks.createNewTask(
        roomie_id,
        name,
        date_assigned,
        date_done
      );
      if (!response.ok) {
        throw new Error("Error al crear la nueva tarea");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al crear la nueva tarea:", error);
    }
  };

  const updateTaskDate = async (task_id, new_date_assigned) => {
    try {
      const response = await authTasks.updateTaskDate(
        task_id,
        new_date_assigned
      );
      if (!response.ok) {
        throw new Error("Error al actualizar la fecha de la tarea");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al actualizar la fecha de la tarea:", error);
    }
  };

  const markTaskAsDone = async (task_id) => {
    try {
      const response = await authTasks.markTaskAsDone(task_id);
      if (!response.ok) {
        throw new Error("Error al marcar la tarea como completada");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al marcar la tarea como completada:", error);
    }
  };

  const deleteTask = async (task_id) => {
    try {
      const response = await authTasks.deleteTask(task_id);
      if (!response.ok) {
        throw new Error("Error al eliminar la tarea");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
    }
  };

  const store = {
    token,
    roomie_id,
    is_admin,
    home_id,
    roomieData,
    authenticated,
    filesInfo,
    setFilesInfo,
    cloudinaryRef,
    widgetRef,
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
    getExpensesByRoomieId,
    getRoomiesByHomeId,
    createDebt,
    getDebtsByRoomieId,
    payDebt,
    getRoomieById,
    getFiles,
    uploadFile,
    getTasksByHomeId,
    getTaskById,
    createNewTask,
    updateTaskDate,
    markTaskAsDone,
    deleteTask,
  };

  return (
    <AppContext.Provider value={{ store, actions }}>
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => useContext(AppContext);

export default useAppContext;
