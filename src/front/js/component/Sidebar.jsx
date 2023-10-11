import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

import logo from "../../img/logo.png";

const Sidebar = () => {
  const isLargeScreen = useMediaQuery({ query: "(min-width: 1024px)" });
  const isMediumScreen = useMediaQuery({ query: "(max-width: 1023px)" });
  const isSmallScreen = useMediaQuery({ query: "(max-width: 639px)" });

  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  if (isLargeScreen) {
    return (
      <div className="fixed left-0 top-20 h-full bg-white w-64 rounded-tr-[50px] transition-all duration-300">
        <nav className="p-8">
          <section className="flex items-center">
            <Link to="/" className="text-indigo-900">
              <img className="w-60 h-18 pb-10" src={logo} alt="logo" />
            </Link>
          </section>
          <ul className="space-y-8">
            <li>
              <Link
                to="/"
                className="text-gray-600 hover:text-indigo-300 block"
              >
                <i className="fa-solid fa-house"></i> Inicio
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="text-gray-600 hover:text-indigo-300 block"
              >
                <i className="fa-solid fa-people-roof"></i> Roomies
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="text-gray-600 hover:text-indigo-300 block"
              >
                <i className="fa-solid fa-list-check"></i> Tareas
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="text-gray-600 hover:text-indigo-300 block"
              >
                <i className="fa-solid fa-basket-shopping"></i> Compra
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="text-gray-600 hover:text-indigo-300 block"
              >
                <i className="fa-solid fa-hand-holding-dollar"></i> Gastos
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="text-gray-600 hover:text-indigo-300 block"
              >
                <i className="fa-solid fa-calendar-days"></i> Calendario
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="text-gray-600 hover:text-indigo-300 block"
              >
                <i className="fa-regular fa-folder-open"></i> Archivos
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="text-gray-600 hover:text-indigo-300 block"
              >
                <i className="fa-regular fa-newspaper"></i> Actualizaciones
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
  if (isSmallScreen) {
    return (
      <nav className="bg-white rounded-b-xl">
        <div className="container mx-auto flex items-center justify-between p-4">
          <button onClick={toggleMenu} className="p-2 text-gray-600 ml-2">
            {isMenuVisible ? (
              <i className="fa-solid fa-xmark" />
            ) : (
              <i className="fa-solid fa-bars" />
            )}
          </button>
          <Link to="/" className="logo">
            <img src={logo} alt="Logo" className="w-30 h-10" />
          </Link>
        </div>
        {isMenuVisible && (
          <div className="sidebar-content">
            <ul className="space-y-5 ps-6">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-indigo-300 block"
                >
                  <i className="fa-solid fa-house"></i> Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-indigo-300 block"
                >
                  <i className="fa-solid fa-people-roof"></i> Roomies
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-indigo-300 block"
                >
                  <i className="fa-solid fa-list-check"></i> Tareas
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-indigo-300 block"
                >
                  <i className="fa-solid fa-basket-shopping"></i> Compra
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-indigo-300 block"
                >
                  <i className="fa-solid fa-hand-holding-dollar"></i> Gastos
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-indigo-300 block"
                >
                  <i className="fa-solid fa-calendar-days"></i> Calendario
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-indigo-300 block"
                >
                  <i className="fa-regular fa-folder-open"></i> Archivos
                </Link>
              </li>
              <li className="pb-6">
                <Link
                  to="/"
                  className="text-gray-600 hover:text-indigo-300 block"
                >
                  <i className="fa-regular fa-newspaper"></i> Actualizaciones
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    );
  }
  if (isMediumScreen) {
    return (
      <div className="fixed top-0 w-full bg-white">
        <button
          onClick={toggleMenu}
          className="p-2 text-gray-600 absolute top-4 left-4"
        >
          {isMenuVisible ? (
            <i className="fa-solid fa-xmark" />
          ) : (
            <i className="fa-solid fa-bars" />
          )}
        </button>
        <div
          className={`w-64 fixed top-20 h-full bg-white rounded-tr-[50px] transition-all duration-300 ${
            isMenuVisible ? "" : "hidden"
          } transition-all duration-300`}
        >
          <nav className="p-8">
            <section className="flex items-center">
              <Link to="/" className="text-indigo-900">
                <img className="w-60 h-18 pb-10" src={logo} alt="logo" />
              </Link>
            </section>
            <ul className="space-y-8">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-indigo-300 block"
                >
                  <i className="fa-solid fa-house"></i> Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-indigo-300 block"
                >
                  <i className="fa-solid fa-people-roof"></i> Roomies
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-indigo-300 block"
                >
                  <i className="fa-solid fa-list-check"></i> Tareas
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-indigo-300 block"
                >
                  <i className="fa-solid fa-basket-shopping"></i> Compra
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-indigo-300 block"
                >
                  <i className="fa-solid fa-hand-holding-dollar"></i> Gastos
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-indigo-300 block"
                >
                  <i className="fa-solid fa-calendar-days"></i> Calendario
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-indigo-300 block"
                >
                  <i className="fa-regular fa-folder-open"></i> Archivos
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-indigo-300 block"
                >
                  <i className="fa-regular fa-newspaper"></i> Actualizaciones
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    );
  }

  return null;
};

export default Sidebar;
