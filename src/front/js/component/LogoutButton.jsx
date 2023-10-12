import React from "react";
import { Link } from "react-router-dom";

import useAppContext from "../contexts/AppContext.jsx";

const LogoutButton = () => {
  const { actions } = useAppContext();

  const handleLogout = () => {
    actions.logout();
  };

  return (
    <Link
      to="/"
      className="text-indigo-400 hover:text-indigo-900 block"
      onClick={handleLogout}
    >
      <i className="fa-solid fa-sign-out-alt"></i>Cerrar sesión
    </Link>
  );
};

export default LogoutButton;
