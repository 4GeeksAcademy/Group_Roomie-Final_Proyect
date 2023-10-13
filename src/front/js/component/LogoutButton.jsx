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
      className="text-orange-300 hover:text-orange-600 block"
      onClick={handleLogout}
    >
      <i className="fa-solid fa-sign-out-alt"></i>Cerrar sesión
    </Link>
  );
};

export default LogoutButton;
