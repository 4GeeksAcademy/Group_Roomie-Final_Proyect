import React from "react";
import "../../styles/navbar.css"
import Logo from "../images/logo";
import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {

  const location = useLocation();

  return (
    <div className="navbar">
      <Logo />
      <div>
    <ul>
      <Link to="/" className={location.pathname === "/" ? "active" : ""}>Mi home</Link>
      <Link to="/roomies" className={location.pathname === "/roomies" ? "active" : ""}>Roomies</Link>
      <Link to="/calendario" className={location.pathname === "/calendario" ? "active" : ""}>Calendario</Link>
      <Link to="/tareas" className={location.pathname === "/tareas" ? "active" : ""}>Tareas</Link>
      <Link to="/compra" className={location.pathname === "/compra" ? "active" : ""}>Compra</Link>
      <Link to="/gastos" className={location.pathname === "/gastos" ? "active" : ""}>Gastos</Link>
      <Link to="/actualizaciones" className={location.pathname === "/actualizaciones" ? "active" : ""}>Actualizaciones</Link>
      <Link to="/archivos" className={location.pathname === "/archivos" ? "active" : ""}>Archivos</Link>
      </ul>
      </div>
    </div>
  );
};
