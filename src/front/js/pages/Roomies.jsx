import React, { useState } from "react";
import useAuthHome from "../services/authHome"; 
import ModalEliminar from "../component/ModalEliminar.jsx";
import ModalBuscar from "../component/ModalBuscar.jsx";
import CreateHomeModal from "../component/CreateHomeModal.jsx";

function Roomies() {
  const currentUser = { createdHome: true };
  const { roomies, isAdmin, error, createHome, homeName } = useAuthHome(currentUser);

  const [modalOpen, setModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [roomie_id, setRoomieId] = useState(localStorage.getItem("roomie_id"));
  const [showCreateHomeModal, setShowCreateHomeModal] = useState(false);

  const handleCreateHomeClick = () => {
    setShowCreateHomeModal(true);
  };

  const handleEliminarClick = () => {
    setModalOpen(true);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setShowModal(false);
  };

  return (
    <section className="lg:ms-[256px] mx-auto sm:px-6 lg:px-3 py-12">
      <div className="text-center pb-12">
        <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl font-heading text-gray-900">
          Roomies
        </h1>
      </div>

      <div>
        {isAdmin ? (
          <p>Tú eres el administrador del Home: {homeName}</p>
        ) : (
          <button 
            onClick={handleCreateHomeClick}
            className="min-w-auto w-32 h-10 p-2 rounded-xl bg-orange-600 hover:bg-orange-300 transition-colors duration-50 hover:ease-out text-white font-bold"
                  >
            Crear Home
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 w-full gap-12">
        {roomies.map((roomie) => (
          <div key={roomie.id} className="w-full max-w-lg mx-auto px-4 sm:px-6 bg-white flex flex-col justify-center items-center h-full rounded-lg">
            <div className="mb-8">
              <img
                className="object-center object-cover rounded-full h-36 w-36"
                src={roomie.avatar}
              />
            </div>
            <div className="text-center">
              <p className="text-xl text-gray-600 font-bold mb-2">{roomie.first_name} {roomie.last_name}</p>
              {isAdmin ? (
                <p className="text-base text-gray-400 font-normal">Admin</p>
              ) : null}
              {isAdmin ? (
                <>
                  <button
                    onClick={handleEliminarClick}
                    className="min-w-auto w-32 h-10 p-2 rounded-xl bg-orange-600 hover:bg-orange-300 transition-colors duration-50 hover:ease-out text-white font-bold"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={handleOpenModal}
                    className="min-w-auto w-32 h-10 p-2 rounded-xl bg-orange-600 hover:bg-orange-300 transition-colors duration-50 hover:ease-out text-white font-bold"
                  >
                    Agregar Roomie
                  </button>
                  <button
                    onClick={() => setShowModal(true)} 
                    className="min-w-auto w-32 h-10 p-2 rounded-xl bg-orange-600 hover:bg-orange-300 transition-colors duration-50 hover:ease-out text-white font-bold"
                  >
                    Buscar Roomie
                  </button>
                </>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      {modalOpen && (
        <ModalEliminar isOpen={modalOpen} onClose={handleCloseModal} roomieId={roomie_id} />
      )}

      {showModal && (
        <ModalBuscar onClose={handleCloseModal} />
      )}

{showCreateHomeModal && (
  <CreateHomeModal
    open={showCreateHomeModal}
    onClose={() => setShowCreateHomeModal(false)}
    createHome={createHome}
    isAdmin={isAdmin}
    homeName={homeName} 
  />
)}
    </section>
  );
}

export default Roomies;
