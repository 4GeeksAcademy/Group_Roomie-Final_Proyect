import React, { useState, useEffect } from "react";

import useAppContext from "../contexts/AppContext.jsx";

const ProfileModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    password: "",
    repeat_password: "",
    paypal_id: "",
    avatar: "",
  });
  const { actions, store } = useAppContext();
  const { widgetRef } = store;

  useEffect(() => {
    const roomie_id = localStorage.getItem("roomie_id");
    const fetchAvatar = async () => {
      try {
        const roomieData = await actions.getRoomieData(roomie_id);
        console.log(roomieData);
        setFormData((prevData) => ({
          ...prevData,
          avatar: roomieData.avatar,
        }));
      } catch (error) {
        console.error("Error al obtener el avatar", error);
      }
    };
    fetchAvatar();
  }, []);

  const handleUpload = () => {
    widgetRef.current.open();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleClose = () => {
    const resetData = {};
    if (formData.first_name) resetData.first_name = "";
    if (formData.last_name) resetData.last_name = "";
    if (formData.password) resetData.password = "";
    if (formData.repeat_password) resetData.repeat_password = "";
    if (formData.paypal_id) resetData.paypal_id = "";
    if (formData.avatar) resetData.avatar = "";
    setFormData({ ...formData, ...resetData });
    onClose();
  };

  const handleUpdate = async () => {
    if (formData.password.length > 0) {
      if (formData.password.length < 8) {
        console.error("La contraseña debe tener al menos 8 caracteres");
        return;
      } else if (formData.password != formData.repeat_password) {
        console.error("Las contraseñas no coinciden");
        return;
      }
    }
    const { repeat_password, ...updatedData } = formData;
    if (store.filesInfo.length > 0) {
      updatedData.avatar == store.filesInfo[0].url;
    }
    await actions.updateRoomieData(updatedData, () => {
      onClose();
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4 text-center">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span
          className="inline-block align-middle bg-white rounded-[50px] text-left overflow-hidden shadow-xl transform transition-all my-8 w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="p-6 sm:p-8">
            <h2
              className="text-xl md:text-2xl lg:text-2xl font-bold leading-6 text-gray-700 text-center"
              id="modal-headline"
            >
              Actualizar perfil
            </h2>
            <form className="mt-4">
              <div className="mb-4 flex justify-center">
                <div className="relative inline-block">
                  <button
                    type="button"
                    onClick={handleUpload}
                    className="bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded-full mt-2 shadow h-20 w-20 flex items-center justify-center"
                    style={{
                      backgroundImage: formData.avatar ? (
                        `url(${formData.avatar})`
                      ) : (
                        <i className="fa-regular fa-user fa-2xl"></i>
                      ),
                      backgroundSize: "cover",
                    }}
                  ></button>
                </div>
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-base md:text-lg lg:text-base mb-2"
                  htmlFor="nombre"
                >
                  Nombre
                </label>
                <input
                  type="text"
                  name="first_name"
                  placeholder="Nuevo nombre"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="border border-gray-300 focus:border-gray-300 rounded-lg p-3 w-full"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-base md:text-lg lg:text-base mb-2"
                  htmlFor="apellido"
                >
                  Apellido
                </label>
                <input
                  type="text"
                  name="last_name"
                  placeholder="Nuevo apellido"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="border border-gray-300 focus:border-gray-300 rounded-lg p-3 w-full"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-base md:text-lg lg:text-base mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Nueva password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="border border-gray-300 focus:border-gray-300 rounded-lg p-3 w-full"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-base md:text-lg lg:text-base mb-2"
                  htmlFor="password"
                >
                  Repite password
                </label>
                <input
                  type="password"
                  name="repeat_password"
                  placeholder="Repite nueva password"
                  value={formData.repeat_password}
                  onChange={handleInputChange}
                  className="border border-gray-300 focus:border-gray-300 rounded-lg p-3 w-full"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-base md:text-lg lg:text-base mb-2"
                  htmlFor="paypal_id"
                >
                  PayPal ID
                </label>
                <input
                  type="text"
                  name="paypal_id"
                  placeholder="Nuevo PayPal ID"
                  value={formData.paypal_id}
                  onChange={handleInputChange}
                  className="border border-gray-300 focus:border-gray-300 rounded-lg p-3 w-full"
                />
              </div>
              <div className="text-right mt-4">
                <button
                  type="button"
                  className="bg-indigo-100 hover:bg-indigo-300 text-gray-600 font-bold py-2 px-4 rounded-xl mr-2"
                  onClick={handleClose}
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  className="bg-orange-600 hover:bg-orange-300 text-white font-bold py-2 px-4 rounded-xl"
                  onClick={handleUpdate}
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </span>
      </div>
    </div>
  );
};

export default ProfileModal;