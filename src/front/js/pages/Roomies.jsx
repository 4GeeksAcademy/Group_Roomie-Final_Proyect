import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import useAppContext from "../contexts/AppContext.jsx";
import CreateHomeModal from "../component/CreateHomeModal.jsx";
import ModalBuscar from "../component/ModalBuscar.jsx";
import authHome from "../services/authHome.js";
import Loader from "../component/Loader.jsx";

import toast from "react-hot-toast";

const Roomies = () => {
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const { actions, store } = useAppContext();
  const isAdmin = localStorage.getItem("is_admin") === "true";
  const [roomies, setRoomies] = useState([]);
  const navigate = useNavigate();

  const fetchRoomies = async () => {
    try {
      const roomiesData = await actions.getRoomiesByHomeId(store.home_id);
      setRoomies(roomiesData);
    } catch (error) {
      console.error("Error al obtener los roomies:", error);
    } finally {
    }
  };

  useEffect(() => {
    if (store.home_id !== "null") {
      fetchRoomies();
    }
  }, [actions, store.home_id]);

  const handleDeleteRoomie = async (roomieId) => {
    try {
      await authHome.deleteRoomieFromHome(store.home_id, roomieId);
      fetchRoomies();
      toast.success("Roomie eliminado de la vivienda correctamente", {
        duration: 3000,
      });
    } catch (error) {
      console.error("Error al eliminar al compañero de vivienda:", error);
    }
  };

  const handleDeactivateHome = async () => {
    try {
      const response = await authHome.desactivateHome(store.home_id);
      if (response.is_active == false) {
        localStorage.setItem("home_id", null);
        localStorage.setItem("is_admin", false);
      } else {
        fetchRoomies();
      }
      navigate("/home");
      toast.success("Vivienda desactivada correctamente", {
        duration: 3000,
      });
    } catch (error) {
      console.error("Error al desactivar la vivienda:", error);
    }
  };

  return (
    <>
      <div className="masonry md:masonry-lg xl:masonry-xl z-0 mt-5 sm:mt-10 md:mt-10 lg:mt-20 lg:ms-72 mx-2">
        {roomies.map((roomie) => (
          <div
            key={roomie.id}
            className="bg-white rounded-[50px] p-6 mb-6 break-inside flex flex-col items-center justify-center text-center"
          >
            <div className="bg-gray-300 rounded-full shadow flex items-center justify-center w-20 h-20 lg:w-24 lg:h-24">
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
            <h2 className="text-gray-800 text-xl my-3">{roomie.first_name}</h2>
            {roomie.admin ||
            (roomie.id === parseInt(localStorage.getItem("user_id")) &&
              localStorage.getItem("is_admin") === "true") ? (
              <p className="text-md text-indigo-600">Administrador</p>
            ) : null}
            {!roomie.admin && isAdmin && (
              <button
                onClick={() => handleDeleteRoomie(roomie.id)}
                className="bg-red-600 hover:bg-red-300 text-white font-bold py-2 px-2 rounded-xl mt-3"
              >
                Eliminar
              </button>
            )}
          </div>
        ))}
      </div>

      {store.home_id === "null" && (
        <div className="flex items-center justify-center h-screen">
          <button
            onClick={() => setShowModalCreate(true)}
            className="bg-orange-600 hover:bg-orange-300 text-white font-bold py-2 px-4 rounded-xl flex items-center justify-center"
          >
            Crear una vivienda
          </button>
        </div>
      )}
      {showModalCreate && (
        <CreateHomeModal
          onClose={() => setShowModalCreate(false)}
          onSubmit={authHome.createHome}
          fetchRoomies={fetchRoomies}
        />
      )}

      {isAdmin && (
        <button
          onClick={handleDeactivateHome}
          className="bg-indigo-300 hover:bg-indigo-400 text-gray-600 font-bold py-2 px-4 rounded-xl mt-4"
          style={{ position: "fixed", bottom: "2rem", right: "12rem" }}
        >
          Desactivar Vivienda
        </button>
      )}
      {isAdmin && (
        <button
          onClick={() => setShowModalAdd(true)}
          className="bg-orange-600 hover:bg-orange-300 text-white font-bold py-2 px-4 rounded-xl mt-4"
          style={{ position: "fixed", bottom: "2rem", right: "2rem" }}
        >
          Añadir Roomie
        </button>
      )}
      {showModalAdd && (
        <ModalBuscar
          onClose={() => setShowModalAdd(false)}
          onSubmit={authHome.addRoomieToHomeByEmail}
        />
      )}
    </>
  );
};

export default Roomies;
