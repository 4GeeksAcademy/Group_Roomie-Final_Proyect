import React, { useEffect, useState } from "react";

import useAppContext from "../contexts/AppContext.jsx";
import ProfileModal from "../component/ProfileModal.jsx";

const Profile = () => {
  const { actions, store } = useAppContext();
  const { roomieData } = store;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    actions.getRoomieData();
  }, [actions]);

  return (
    <>
      <div className="flex items-center justify-center sm:mt-8 h-screen bg-gray-100">
        <div className="bg-white rounded-[50px] p-6 md:p-12 max-w-lg w-full">
          <h1 className="text-2xl text-gray-700 font-bold mb-4 text-center">
            Mis datos
          </h1>
          {roomieData && (
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col items-start">
                <span className="text-gray-700 text-base md:text-lg lg:text-base mb-1 w-11/12">
                  Nombre
                </span>
                <p className="border border-gray-300 rounded-lg p-3 w-11/12">
                  {roomieData.first_name}
                </p>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-gray-700 text-base md:text-lg lg:text-base mb-1 w-11/12">
                  Apellido
                </span>
                <p className="border border-gray-300 rounded-lg p-3 w-11/12">
                  {roomieData.last_name}
                </p>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-gray-700 text-base md:text-lg lg:text-base mb-1 w-11/12">
                  Email
                  <span className="text-sm text-red-500 ml-2">
                    *Este campo no se puede modificar.
                  </span>
                </span>

                <p className="border border-gray-300 rounded-lg p-3 w-11/12">
                  {roomieData.email}
                </p>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-gray-700 text-base md:text-lg lg:text-base mb-1 w-11/12">
                  Password
                </span>
                <p className="border border-gray-300 rounded-lg p-3 w-11/12">
                  ********
                </p>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-gray-700 text-base md:text-lg lg:text-base mb-1 w-11/12">
                  PayPal ID
                </span>
                <p className="border border-gray-300 rounded-lg p-3 w-11/12">
                  {roomieData.paypal_id}
                </p>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-gray-700 text-base md:text-lg lg:text-base mb-1 w-11/12">
                  Avatar
                </span>
                <p className="border border-gray-300 rounded-lg p-3 w-11/12">
                  {roomieData.avatar}
                </p>
              </div>
            </div>
          )}
          <div className="flex justify-end mt-5">
            <button
              className="bg-orange-600 hover:bg-orange-300 text-white font-bold py-2 px-4 rounded-xl"
              onClick={handleOpenModal}
            >
              Editar Perfil
            </button>
          </div>
        </div>
      </div>
      <ProfileModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default Profile;
