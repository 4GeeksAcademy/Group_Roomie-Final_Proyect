import React from "react";

import useAppContext from "../contexts/AppContext.jsx";

const LogoutButton = () => {
  const { actions } = useAppContext();

  const handleLogout = () => {
    actions.logout();
  };

  return (
    <button
      className="fixed top-5 right-5 bg-indigo-400 text-white font-bold px-4 py-2 rounded-[50px]"
      onClick={handleLogout}
    >
      Cerrar sesión
    </button>
  );
};

export default LogoutButton;
