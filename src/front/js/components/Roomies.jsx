import React, { useRef, useState } from 'react';
import ModalEliminar from './ModalEliminar.jsx';
import ModalBuscar from './ModalBuscar.jsx'; // Asegúrate de que la ruta sea correcta

function Roomies() {
  
  const [modalOpen, setModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);


  const handleEliminarClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
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
          <div className="text-center ">
            <p className="text-xl text-gray-600 font-bold mb-2">Dany Bailey</p>
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
            <p className="text-xl text-gray-600 font-bold mb-2">Lucy Carter</p>
            <button 
            onClick={handleEliminarClick}
            className="min-w-auto w-32 h-10 bg-red-300 p-2 rounded-xl hover:bg-red-500 transition-colors duration-50 hover:ease-out text-white font-semibold">
              Eliminar
            </button>
          </div>
        </div>

        <div className="w-4/5 bg-white p-12 flex flex-col justify-center items-center h-full rounded-t-lg">
  <div className="mb-8">
    <button
      className="w-40 h-40 rounded-full bg-indigo-300 text-white flex items-center justify-center hover:bg-indigo-300/50"
      onClick={() => setShowModal(true)} 
    >
      <i className="fa-solid fa-plus fa-2xl"></i>
    </button>
  </div>
  <div className="text-center">
    <p className="text-xl text-gray-600 font-bold mb-2">Invita a un nuevo Roomie</p>
  </div>

 
  {showModal && (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <ModalBuscar onClose={() => setShowModal(false)} />
      </div>
    </div>
  )}
</div>
      </div>
      {modalOpen && (
        <ModalEliminar onClose={handleCloseModal} />
      )}
    </section>
  );
}

export default Roomies;
