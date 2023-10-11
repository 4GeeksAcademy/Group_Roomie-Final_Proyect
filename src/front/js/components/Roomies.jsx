import React, { useState } from 'react';
import ModalEliminar from './ModalEliminar.jsx';

function Roomies() {
  const [modalVisible, setModalVisible] = useState(false);

  const mostrarModalEliminar = () => {
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-4 py-12">
      <div className="text-center pb-12">
        <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl font-heading text-gray-900">
          Roomies
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 h-screen">
        <div className="w-4/5 bg-white p-12 flex flex-col justify-center items-center h-full rounded-t-lg">
          <div className="mb-8">
            <img
              className="object-center object-cover rounded-full h-36 w-36"
              src="https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80"
              alt="photo"
            />
          </div>
          <div className="text-center">
            <p className="text-xl text-gray-700 font-bold mb-2">Dany Bailey</p>
            <p className="text-base text-gray-400 font-normal">Admin</p>
          </div>
        </div>
        <div className="w-4/5 bg-white p-12 flex flex-col justify-center items-center h-full rounded-t-lg">
          <div className="mb-8">
            <img
              className="object-center object-cover rounded-full h-36 w-36"
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80"
              alt="photo"
            />
          </div>
          <div className="text-center">
            <p className="text-xl text-gray-700 font-bold mb-2">Lucy Carter</p>
            <button 
            onClick={mostrarModalEliminar}
            className="min-w-auto w-32 h-10 bg-red-300 p-2 rounded-xl hover:bg-red-500 transition-colors duration-50 hover:ease-out text-white font-semibold">
              Eliminar
            </button>
          </div>
        </div>
      </div>
      {modalVisible && <ModalEliminar onClose={cerrarModal} />}
    </section>
  );
}

export default Roomies;
