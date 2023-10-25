import React from "react";
import { Link, useNavigate } from "react-router-dom";

import useAppContext from "../contexts/AppContext.jsx";

const LogoutButton = () => {
  const { actions } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    actions.logout();
    navigate("/");
  };

  return (
    <Link
      to="/"
      className="text-orange-300 hover:text-orange-600 block"
      onClick={handleLogout}
    >
      <i className="fa-solid fa-sign-out-alt pr-1"></i>Cerrar sesión
    </Link>
  );
};

export default LogoutButton;