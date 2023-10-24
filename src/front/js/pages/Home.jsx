import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import useAppContext from "../contexts/AppContext.jsx";

const Home = () => {
  const [roomies, setRoomies] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [shopList, setShopList] = useState({});
  const [tasks, setTasks] = useState([]);
  const { actions, store } = useAppContext();
  const { roomieData, homeData } = store;

  useEffect(() => {
    const fetchData = async () => {
      try {
        await actions.getRoomieData();
        await actions.fetchHomeData();
        const roomiesByHomeId = await actions.getRoomiesByHomeId(homeData.id);
        setRoomies(roomiesByHomeId);
        const shopListResponse = await actions.getShopList();
        if (shopListResponse != null) {
          setShopList(shopListResponse);
          const allItems = await actions.getAllItems(shopListResponse.id);
          if (Array.isArray(allItems)) {
            setShoppingList(allItems.slice(0, 5));
          } else {
            console.error("La lista de ítems no es un array:", allItems);
          }
        }
        const roomieId = localStorage.getItem("roomie_id");
        const tasksResponse = await actions.getTasksbyRoomieId(roomieId, true);
        if (Array.isArray(tasksResponse)) {
          setTasks(tasksResponse.slice(0, 5));
        } else {
          console.error("La lista de tareas no es un array:", tasksResponse);
        }
      } catch (error) {
        console.error(
          "Error al obtener los roomies o la lista de ítems:",
          error
        );
      }
    };

    fetchData();
  }, [actions]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6 sm:mt-20 lg:ms-72">
      <div className=" bg-indigo-300 rounded-[50px] p-6 mb-4 h-[200px] flex">
        <div className="text-left sm:text-left md:text-left w-full md:w-auto">
          <h1 className="text-2xl md:text-4xl text-white font-bold mb-2 md:mb-6">
            Hola, {roomieData.first_name}
          </h1>
          <h2 className="text-xl md:text-2xl text-white mb-4">
            Bienvenid@ a {homeData.name}
          </h2>
        </div>
        <div className="flex-shrink-0">
          <div
            className="bg-gray-300 rounded-full shadow h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 md:ms-6 flex items-center justify-end"
            style={{
              backgroundImage: roomieData.avatar
                ? `url(${roomieData.avatar})`
                : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {!roomieData.avatar && (
              <i className="fa-regular fa-user fa-lg md:fa-2xl text-white"></i>
            )}
          </div>
        </div>
      </div>

      {/* Contenedor de Lista de Compra */}
      <div className="bg-white rounded-[50px] p-6 mb-4 h-[380px] relative">
        <h2 className="text-xl md:text-2xl text-gray-600 font-bold mb-2 md:mb-6">
          Lista de la compra
        </h2>
        <ul className="list-none list-inside">
          {shoppingList.map((item, index) => (
            <li
              key={index}
              className="text-gray-800 border-b border-indigo-300 py-2 flex items-center"
            >
              <i className="fa-regular fa-square mr-2"></i>
              {item.name}
            </li>
          ))}
        </ul>
        <div className="absolute bottom-4 right-4">
          <Link to="/shoplist">
            <button className="w-12 h-12 rounded-full bg-orange-600 hover:bg-orange-300 flex items-center justify-center">
              <span className="text-white text-4xl font-bold pb-2">+</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Contenedor de Últimas Entradas del Blog */}
      <div className="bg-white rounded-[50px] p-6 mb-4">
        <h2 className="text-xl md:text-2xl text-gray-600 font-bold mb-2 md:mb-6">
          Actualizaciones
        </h2>
      </div>

      {/* Contenedor de Roomies */}
      <div className="bg-white rounded-[50px] p-6 mb-4 h-[200px] relative">
        <h2 className="text-xl md:text-2xl text-gray-600 font-bold mb-2 md:mb-6">
          Roomies
        </h2>
        <div className="flex -space-x-2 overflow-hidden">
          {roomies.map((roomie, index) => (
            <div
              key={index}
              className="bg-gray-300 hover:bg-gray-400 rounded-full ring-2 ring-white mt-2 shadow flex items-center justify-center"
              style={{ width: "6rem", height: "6rem" }}
            >
              {roomie.avatar ? (
                <img
                  className="rounded-full w-full h-full object-cover"
                  src={roomie.avatar}
                  alt=""
                />
              ) : (
                <i className="fa-regular fa-user fa-lg md:fa-2xl text-white"></i>
              )}
            </div>
          ))}
        </div>
        <div className="absolute bottom-4 right-4">
          <Link to="/roomies">
            <button className="w-12 h-12 rounded-full bg-orange-600 hover:bg-orange-300 flex items-center justify-center">
              <span className="text-white text-4xl font-bold pb-2">+</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Contenedor de Tareas Pendientes */}
      <div className="bg-white rounded-[50px] p-6 mb-4 h-[380px] relative">
        <h2 className="text-xl md:text-2xl text-gray-600 font-bold mb-2 md:mb-6">
          Mis tareas
        </h2>
        <ul className="list-none list-inside">
          {tasks.map((task, index) => (
            <li
              key={index}
              className="text-gray-800 border-b border-indigo-300 py-2 flex items-center"
            >
              <i className="fa-regular fa-square mr-2"></i>
              {task.name}
            </li>
          ))}
        </ul>
        <div className="absolute bottom-4 right-4">
          <Link to="/tasks">
            <button className="w-12 h-12 rounded-full bg-orange-600 hover:bg-orange-300 flex items-center justify-center">
              <span className="text-white text-4xl font-bold pb-2">+</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Contenedor de Calendario Mensual */}
      <div className="bg-white rounded-[50px] p-6 mb-4">
        <h2 className="text-xl md:text-2xl text-gray-600 font-bold mb-2 md:mb-6">
          Mi calendario
        </h2>
      </div>

      {/* Contenedor de Pagos y Deudas */}
      <div className="bg-white rounded-[50px] p-6 mb-4">
        <h2 className="text-xl md:text-2xl text-gray-600 font-bold mb-2 md:mb-6">
          Mis gastos
        </h2>
      </div>
    </div>
  );
};

export default Home;
