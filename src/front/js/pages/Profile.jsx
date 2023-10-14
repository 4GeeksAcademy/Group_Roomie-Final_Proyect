import React, { useState, useEffect } from "react";

import ProfileModal from "../component/ProfileModal.jsx";
import useAppContext from "../contexts/AppContext.jsx";

const Profile = () => {
  const { actions, store } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomieData, setRoomieData] = useState({
    // first_name: "",
    // last_name: "",
    // email: "",
    // password: "",
    // paypal_id: "",
    // avatar: "",
  });

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    let isMounted = true;
    actions.getRoomieData().then((data) => {
      if (isMounted) {
        setRoomieData(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white rounded-[50px] p-6 md:p-12 max-w-lg w-full max-h-[80%] overflow-y-auto">
          <h1 className="text-2xl text-gray-700 font-bold mb-4 text-center">
            Mis datos
          </h1>
          <form className="flex flex-col items-center space-y-4">
            <div className="mb-4 w-11/12">
              <label
                className="block text-gray-700 text-base md:text-lg lg:text-base mb-2"
                htmlFor="first_name"
              >
                Nombre
              </label>
              <input
                type="text"
                name="first_name"
                value={
                  roomieData && roomieData.first_name
                    ? roomieData.first_name
                    : ""
                }
                className="border border-gray-300 focus:border-gray-300 rounded-lg p-3 w-full"
                readOnly
              />
            </div>
            <div className="mb-4 w-11/12">
              <label
                className="block text-gray-700 text-base md:text-lg lg:text-base mb-2"
                htmlFor="last_name"
              >
                Apellido
              </label>
              <input
                type="text"
                name="last_name"
                value={
                  roomieData && roomieData.last_name ? roomieData.last_name : ""
                }
                className="border border-gray-300 focus:border-gray-300 rounded-lg p-3 w-full"
                readOnly
              />
            </div>
            <div className="mb-4 w-11/12">
              <label
                className="block text-gray-700 text-base md:text-lg lg:text-base mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={roomieData && roomieData.email ? roomieData.email : ""}
                className="border border-gray-300 focus:border-gray-300 rounded-lg p-3 w-full"
                readOnly
              />
            </div>
            <div className="mb-4 w-11/12">
              <label
                className="block text-gray-700 text-base md:text-lg lg:text-base mb-2"
                htmlFor="password"
              >
                Contraseña
              </label>
              <input
                type="password"
                name="contraseña"
                value={
                  roomieData && roomieData.password ? roomieData.password : ""
                }
                className="border border-gray-300 focus:border-gray-300 rounded-lg p-3 w-full"
                readOnly
              />
            </div>
            <div className="mb-4 w-11/12">
              <label
                className="block text-gray-700 text-base md:text-lg lg:text-base mb-2"
                htmlFor="paypal"
              >
                PayPal ID
              </label>
              <input
                type="text"
                name="paypal"
                value={
                  roomieData && roomieData.paypal_id ? roomieData.paypal_id : ""
                }
                className="border border-gray-300 focus:border-gray-300 rounded-lg p-3 w-full"
                readOnly
              />
            </div>
            <div className="mb-4 w-11/12">
              <label
                className="block text-gray-700 text-base md:text-lg lg:text-base mb-2"
                htmlFor="avatar"
              >
                Avatar
              </label>
              <input
                type="text"
                name="avatar"
                value={roomieData && roomieData.avatar ? roomieData.avatar : ""}
                className="border border-gray-300 focus:border-gray-300 rounded-lg p-3 w-full"
                readOnly
              />
            </div>
          </form>
        </div>
        <button
          className="fixed bottom-10 right-10 bg-orange-600 hover:bg-orange-300 text-white font-bold py-2 px-4 rounded-xl"
          onClick={handleOpenModal}
        >
          Editar Perfil
        </button>
      </div>
      <ProfileModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        first_name={
          roomieData && roomieData.first_name ? roomieData.first_name : ""
        }
        last_name={roomieData && roomieData.last_name}
        email={roomieData && roomieData.email}
        password={roomieData && roomieData.password}
        paypal_id={roomieData && roomieData.paypal_id}
        avatar={roomieData && roomieData.avatar}
      />
    </>
  );
};

export default Profile;
