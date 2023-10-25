import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

import useAppContext from "../contexts/AppContext.jsx";
import LogoutButton from "./LogoutButton.jsx";

import logo from "../../img/logo.png";

const Sidebar = () => {
  const { store } = useAppContext();
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
            <Link to="/home" className="text-indigo-900">
              <img className="w-60 h-18 pb-10" src={logo} alt="logo" />
            </Link>
          </section>
          <ul className="space-y-4">
            <li>
              <Link
                to="/home"
                className="text-gray-600 hover:text-indigo-300 block"
              >
                <i className="fa-solid fa-house pr-1"></i> Inicio
              </Link>
            </li>
            <li>
              <Link
                to="/roomies"
                className="text-gray-600 hover:text-indigo-300 block"
              >
                <i className="fa-solid fa-people-roof pr-1"></i> Roomies
              </Link>
            </li>
            <li>
              <Link
                to="/tasks"
                className="text-gray-600 hover:text-indigo-300 block"
              >
                <i className="fa-solid fa-list-check pr-1"></i> Tareas
              </Link>
            </li>
            <li>
              <Link
                to="/shoplist"
                className="text-gray-600 hover:text-indigo-300 block"
              >
                <i className="fa-solid fa-basket-shopping pr-1"></i> Compra
              </Link>
            </li>
            <li>
              <Link
                to="/expenses"
                className="text-gray-600 hover:text-indigo-300 block"
              >
                <i className="fa-solid fa-hand-holding-dollar pr-1"></i> Gastos
              </Link>
            </li>
            <li>
              <Link
                to="/calendar"
                className="text-gray-600 hover:text-indigo-300 block"
              >
                <i className="fa-solid fa-calendar-days pr-1"></i> Calendario
              </Link>
            </li>
            <li>
              <Link
                to="/files"
                className="text-gray-600 hover:text-indigo-300 block"
              >
                <i className="fa-regular fa-folder-open pr-1"></i> Archivos
              </Link>
            </li>
            <li>
              <Link
                to="/blog"
                className="text-gray-600 hover:text-indigo-300 block"
              >
                <i className="fa-regular fa-newspaper pr-1"></i> Actualizaciones
              </Link>
            </li>
            <li>
              <hr className="border-t border-gray-300 my-4" />{" "}
              {/* Línea separadora */}
            </li>
            <li className="flex items-center">
              <Link
                to="/profile"
                className="text-gray-600 hover:text-indigo-300 flex items-center"
              >
                <div className="h-6 w-6 mr-1">
                  {store.roomieData.avatar ? (
                    <img
                      src={store.roomieData.avatar}
                      alt="Avatar"
                      className="w-full h-full rounded-full"
                    />
                  ) : (
                    <i className="fa-regular fa-circle-user pr-1"></i>
                  )}
                </div>
                <span>Perfil</span>
              </Link>
            </li>
            <li>
              <LogoutButton />
            </li>
          </ul>
        </nav>
      </div>
    );
  }
  if (isSmallScreen) {
    return (
      <nav className="bg-white rounded-b-xl h-14 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between p-2">
          <button onClick={toggleMenu} className="p-2 text-gray-600 ml-2">
            {isMenuVisible ? (
              <i className="fa-solid fa-xmark" />
            ) : (
              <i className="fa-solid fa-bars" />
            )}
          </button>
          <Link to="/home" className="logo">
            <img src={logo} alt="Logo" className="w-20 h-10" />
          </Link>
        </div>
        <div
          className={`sidebar-content transition-transform transform duration-300 ${
            isMenuVisible ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ zIndex: 50 }}
        >
          <ul className="space-y-4 ps-6 mt-2 bg-white w-1/2 rounded-xl">
            <li>
              <Link
                to="/home"
                className="text-gray-600 hover:text-indigo-300 block pt-3"
              >
                <i className="fa-solid fa-house"></i> Inicio
              </Link>
            </li>
            <li>
              <Link
                to="/roomies"
                className="text-gray-600 hover:text-indigo-300 block"
              >
                <i className="fa-solid fa-people-roof"></i> Roomies
              </Link>
            </li>
            <li>
              <Link
                to="/tasks"
                className="text-gray-600 hover:text-indigo-300 block"
              >
                <i className="fa-solid fa-list-check"></i> Tareas
              </Link>
            </li>
            <li>
              <Link
                to="/shoplist"
                className="text-gray-600 hover:text-indigo-300 block"
              >
                <i className="fa-solid fa-basket-shopping"></i> Compra
              </Link>
            </li>
            <li>
              <Link
                to="/expenses"
                className="text-gray-600 hover:text-indigo-300 block"
              >
                <i className="fa-solid fa-hand-holding-dollar"></i> Gastos
              </Link>
            </li>
            <li>
              <Link
                to="/calendar"
                className="text-gray-600 hover:text-indigo-300 block"
              >
                <i className="fa-solid fa-calendar-days"></i> Calendario
              </Link>
            </li>
            <li>
              <Link
                to="/files"
                className="text-gray-600 hover:text-indigo-300 block"
              >
                <i className="fa-regular fa-folder-open"></i> Archivos
              </Link>
            </li>
            <li className="pb-4">
              <Link
                to="/blog"
                className="text-gray-600 hover:text-indigo-300 block"
              >
                <i className="fa-regular fa-newspaper"></i> Actualizaciones
              </Link>
            </li>
            <li>
              <hr className="border-t border-gray-300 my-4 mr-4" />{" "}
              {/* Línea separadora */}
            </li>
            <li className="flex items-center">
              <Link
                to="/profile"
                className="text-gray-600 hover:text-indigo-300 flex items-center"
              >
                <div className="h-6 w-6 mr-1">
                  {store.roomieData.avatar ? (
                    <img
                      src={store.roomieData.avatar}
                      alt="Avatar"
                      className="w-full h-full rounded-full"
                    />
                  ) : (
                    <i className="fa-regular fa-circle-user pr-1"></i>
                  )}
                </div>
                <span>Perfil</span>
              </Link>
            </li>
            <li className="pb-4">
              <LogoutButton />
            </li>
          </ul>
        </div>
      </nav>
    );
  }
  if (isMediumScreen) {
    return (
      <div className="w-full sticky z-50">
        <button
          onClick={toggleMenu}
          className="p-2 ms-2 text-gray-600 top-10 left-10"
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
              <Link to="/home" className="text-indigo-900">
                <img className="w-60 h-18 pb-10" src={logo} alt="logo" />
              </Link>
            </section>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/home"
                  className="text-gray-600 hover:text-indigo-300 block"
                >
                  <i className="fa-solid fa-house"></i> Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/roomies"
                  className="text-gray-600 hover:text-indigo-300 block"
                >
                  <i className="fa-solid fa-people-roof"></i> Roomies
                </Link>
              </li>
              <li>
                <Link
                  to="/tasks"
                  className="text-gray-600 hover:text-indigo-300 block"
                >
                  <i className="fa-solid fa-list-check"></i> Tareas
                </Link>
              </li>
              <li>
                <Link
                  to="/shoplist"
                  className="text-gray-600 hover:text-indigo-300 block"
                >
                  <i className="fa-solid fa-basket-shopping"></i> Compra
                </Link>
              </li>
              <li>
                <Link
                  to="/expenses"
                  className="text-gray-600 hover:text-indigo-300 block"
                >
                  <i className="fa-solid fa-hand-holding-dollar"></i> Gastos
                </Link>
              </li>
              <li>
                <Link
                  to="/calendar"
                  className="text-gray-600 hover:text-indigo-300 block"
                >
                  <i className="fa-solid fa-calendar-days"></i> Calendario
                </Link>
              </li>
              <li>
                <Link
                  to="/files"
                  className="text-gray-600 hover:text-indigo-300 block"
                >
                  <i className="fa-regular fa-folder-open"></i> Archivos
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-gray-600 hover:text-indigo-300 block"
                >
                  <i className="fa-regular fa-newspaper"></i> Actualizaciones
                </Link>
              </li>
              <li>
                <hr className="border-t border-gray-300 my-4" />{" "}
                {/* Línea separadora */}
              </li>
              <li className="flex items-center">
                <Link
                  to="/profile"
                  className="text-gray-600 hover:text-indigo-300 flex items-center"
                >
                  <div className="h-6 w-6 mr-1">
                    {store.roomieData.avatar ? (
                      <img
                        src={store.roomieData.avatar}
                        alt="Avatar"
                        className="w-full h-full rounded-full"
                      />
                    ) : (
                      <i className="fa-regular fa-circle-user pr-1"></i>
                    )}
                  </div>
                  <span>Perfil</span>
                </Link>
              </li>
              <li>
                <LogoutButton />
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
