import React, { useState, useEffect } from "react";

import ProfileModal from "../component/ProfileModal.jsx";
import useAppContext from "../contexts/AppContext.jsx";

const Profile = () => {
  const { actions, store } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomieData, setRoomieData] = useState({});

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    let isMounted = true;
    const data = actions.getRoomieData();
    if (data) {
      return setRoomieData(data);
    } else {
      console.error("No se recibieron datos del roomie.");
    }
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
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col items-start">
              <span className="text-gray-700 text-base md:text-lg lg:text-base mb-1 w-11/12">
                Nombre
              </span>
              <p className="border border-gray-300 rounded-lg p-6 w-11/12">
                {roomieData.first_name}
              </p>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-gray-700 text-base md:text-lg lg:text-base mb-1 w-11/12">
                Apellido
              </span>
              <p className="border border-gray-300 rounded-lg p-6 w-11/12">
                {roomieData.last_name}
              </p>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-gray-700 text-base md:text-lg lg:text-base mb-1 w-11/12">
                Email
              </span>
              <p className="border border-gray-300 rounded-lg p-6 w-11/12">
                {roomieData.email}
              </p>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-gray-700 text-base md:text-lg lg:text-base mb-1 w-11/12">
                Password
              </span>
              <p className="border border-gray-300 rounded-lg p-6 w-11/12">
                {roomieData.password}
              </p>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-gray-700 text-base md:text-lg lg:text-base mb-1 w-11/12">
                PayPal ID
              </span>
              <p className="border border-gray-300 rounded-lg p-6 w-11/12">
                {roomieData.paypal_id}
              </p>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-gray-700 text-base md:text-lg lg:text-base mb-1 w-11/12">
                Avatar
              </span>
              <p className="border border-gray-300 rounded-lg p-6 w-11/12">
                {roomieData.avatar}
              </p>
            </div>
          </div>
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
        // first_name={roomieData.first_name}
        // last_name={last_name}
        // email={email}
        // password={password}
        // paypal_id={paypal_id}
        // avatar={avatar}
      />
    </>
  );
};

export default Profile;
