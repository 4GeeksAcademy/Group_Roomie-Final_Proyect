import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "moment/locale/es";

import useAppContext from "../contexts/AppContext.jsx";
import Loader from "../component/Loader.jsx";

moment.locale("es");
const localizer = momentLocalizer(moment);

const eventStyleGetter = (event) => {
  let style = {
    backgroundColor: event.type === "debt" ? "#758bfd" : "#ffaa4d",
    color: "#fff",
    borderRadius: "20px",
    border: "none",
    fontSize: "12px",
  };
  return {
    style: style,
  };
};

const Home = () => {
  const [roomies, setRoomies] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [shopList, setShopList] = useState({});
  const [tasks, setTasks] = useState([]);
  const [blogEntries, setBlogEntries] = useState([]);
  const [totalDebtsToReceive, setTotalDebtsToReceive] = useState(0);
  const [totalDebtsToPay, setTotalDebtsToPay] = useState(0);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { actions, store } = useAppContext();
  const { roomieData, homeData } = store;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await actions.getRoomieData();
        await actions.fetchHomeData();
        const roomiesByHomeId = await actions.getRoomiesByHomeId(homeData.id);
        setRoomies(roomiesByHomeId);
        const shopListResponse = await actions.getShopList();
        if (shopListResponse != null) {
          setShopList(shopListResponse);
          const allItems = await actions.getAllItems(shopListResponse.id);
          if (Array.isArray(allItems)) {
            setShoppingList(allItems.slice(0, 5));
          } else {
            console.error("La lista de ítems no es un array:", allItems);
          }
        }
        const tasksResponse = await actions.getTasksbyRoomieId(
          store.roomie_id,
          true
        );
        if (Array.isArray(tasksResponse)) {
          setTasks(tasksResponse.slice(0, 5));
        } else {
          console.error("La lista de tareas no es un array:", tasksResponse);
        }
        const blogEntriesResponse = await actions.getAllBlogsByHome(
          homeData.id
        );
        if (Array.isArray(blogEntriesResponse)) {
          setBlogEntries(blogEntriesResponse.slice(0, 3));
        } else {
          console.error(
            "La lista de entradas del blog no es un array:",
            blogEntriesResponse
          );
        }
        setLoading(false);
      } catch (error) {
        console.error(
          "Error al obtener las entradas del blog, tareas y roomies:",
          error
        );
        setLoading(false);
      }
    };
    const fetchDebtsData = async () => {
      try {
        setLoading(true);
        const debtsData = await actions.getDebtsByRoomieId(store.roomie_id);
        const debtsToReceiveResponse = debtsData.filter(
          (debt) => debt.roomie_paying_id == store.roomie_id
        );
        const debtsToPayResponse = debtsData.filter(
          (debt) => debt.roomie_debtor_id == store.roomie_id
        );
        if (Array.isArray(debtsToReceiveResponse)) {
          const totalToReceive = debtsToReceiveResponse.reduce(
            (acc, debt) => acc + debt.amount,
            0
          );
          setTotalDebtsToReceive(totalToReceive.toFixed(2));
        }
        if (Array.isArray(debtsToPayResponse)) {
          const totalToPay = debtsToPayResponse.reduce(
            (acc, debt) => acc + debt.amount,
            0
          );
          setTotalDebtsToPay(totalToPay.toFixed(2));
        }
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los datos de deudas:", error);
        setLoading(false);
      }
    };
    const fetchCalendarData = async () => {
      try {
        setLoading(true);
        const data = await actions.fetchCalendarData(store.roomie_id);
        if (data) {
          const formattedData = data.map((event) => {
            return {
              ...event,
              start: new Date(event.start),
              end: new Date(event.end),
            };
          });
          setEvents(formattedData);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los datos del calendario:", error);
        setLoading(false);
      }
    };
    fetchData();
    fetchDebtsData();
    fetchCalendarData();
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="masonry sm:masonry-sm md:masonry-md lg:masonry-lg xl:masonry-xl z-0 mt-5 sm:mt-10 md:mt-10 lg:mt-20 lg:ms-72 lg:me-5 mx-2">
          {/* Contenedor de Bienvenida */}
          {store.home_id !== "null" ? (
            <div className="bg-indigo-300 rounded-[50px] p-6 mb-6 flex break-inside">
              <div className="text-left sm:text-left md:text-left w-full md:w-auto">
                <h1 className="text-2xl md:text-4xl text-white font-bold mb-2 md:mb-6">
                  Hola, {roomieData.first_name}
                </h1>
                <h2 className="text-xl md:text-2xl text-white mb-4">
                  Bienvenid@ a {homeData.name}
                </h2>
              </div>
              <div className="flex-shrink-0">
                <div className="bg-gray-300 rounded-full shadow flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 md:ms-6">
                  {roomieData.avatar ? (
                    <img
                      className="rounded-full w-full h-full object-cover"
                      src={roomieData.avatar}
                      alt=""
                    />
                  ) : (
                    <i className="fa-regular fa-user fa-lg md:fa-2xl text-white"></i>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-indigo-300 rounded-[50px] p-6 mb-6 flex break-inside">
              <div className="text-left sm:text-left md:text-left w-full md:w-auto">
                <h1 className="text-2xl md:text-4xl text-white font-bold mb-2 md:mb-6">
                  Hola, {roomieData.first_name}
                </h1>
                <h2 className="text-xl md:text-2xl text-white mb-4">
                  Bienvenid@ a RoomieConnect
                </h2>
              </div>
              <div className="flex-shrink-0">
                <div className="bg-gray-300 rounded-full shadow flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 md:ms-6">
                  {roomieData.avatar ? (
                    <img
                      className="rounded-full w-full h-full object-cover"
                      src={roomieData.avatar}
                      alt=""
                    />
                  ) : (
                    <i className="fa-regular fa-user fa-lg md:fa-2xl text-white"></i>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Contenedor de Roomies */}
          <div className="bg-white rounded-[50px] p-6 mb-6 break-inside">
            <h2 className="text-xl md:text-2xl text-gray-600 font-bold mb-2 md:mb-6">
              Roomies
            </h2>
            {store.home_id == "null" ? (
              <p className="text-gray-600">No hay roomies</p>
            ) : (
              <div className="flex -space-x-2 overflow-hidden">
                {roomies.map((roomie, index) => (
                  <div
                    key={index}
                    className="bg-gray-300 hover:bg-gray-400 rounded-full ring-2 ring-white mt-2 shadow flex items-center justify-center"
                    style={{ width: "5rem", height: "5rem" }}
                  >
                    {roomie.avatar ? (
                      <img
                        className="rounded-full w-full h-full object-cover"
                        src={roomie.avatar}
                        alt=""
                      />
                    ) : (
                      <i className="fa-regular fa-user fa-lg md:fa-2xl text-white"></i>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="bottom-4 right-4 mt-2 flex justify-end">
              <Link to="/roomies">
                <button className="w-12 h-12 rounded-full bg-orange-600 hover:bg-orange-300 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold pb-2">+</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Contenedor de Pagos y Deudas */}
          <div className="bg-white rounded-[50px] p-6 mb-6 break-inside">
            <h2 className="text-xl md:text-2xl text-gray-600 font-bold mb-2 md:mb-6">
              Mis gastos
            </h2>
            <div className="text-gray-800">
              <p className="bg-green-200 rounded-xl p-4 text-gray-800 mb-2">
                Te deben: {totalDebtsToReceive}€
              </p>
              <p className="bg-red-200 rounded-xl p-4 text-gray-800">
                Debes: {totalDebtsToPay}€
              </p>
            </div>
            <div className="bottom-4 right-4 mt-2 flex justify-end">
              <Link to="/expenses">
                <button className="w-12 h-12 rounded-full bg-orange-600 hover:bg-orange-300 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold pb-2">+</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Contenedor de Lista de Compra */}
          {store.home_id !== "null" ? (
            <div className="bg-white rounded-[50px] p-6 mb-6 break-inside">
              <h2 className="text-xl md:text-2xl text-gray-600 font-bold mb-2 md:mb-6">
                Lista de la compra
              </h2>
              {shoppingList.length > 0 ? (
                <ul className="list-none list-inside">
                  {shoppingList.map((item, index) => (
                    <li
                      key={index}
                      className="text-gray-800 border-b border-indigo-300 py-2 flex items-center"
                    >
                      <i className="fa-regular fa-square mr-2"></i>
                      {item.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="list-none list-inside">
                  <li className="text-gray-800 border-b border-indigo-300 py-2 flex items-center">
                    <i className="fa-regular fa-square mr-2"></i>
                  </li>
                </ul>
              )}
              <div className="bottom-4 right-4 mt-2 flex justify-end">
                <Link to="/shoplist">
                  <button className="w-12 h-12 rounded-full bg-orange-600 hover:bg-orange-300 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold pb-2">
                      +
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[50px] p-6 mb-6 break-inside">
              <h2 className="text-xl md:text-2xl text-gray-600 font-bold mb-2 md:mb-6">
                Lista de la compra
              </h2>
              <ul className="list-none list-inside">
                <li className="text-gray-800 border-b border-indigo-300 py-2 flex items-center">
                  <i className="fa-regular fa-square mr-2"></i>
                </li>
              </ul>
              <div className="bottom-4 right-4 mt-2 flex justify-end">
                <Link to="/shoplist">
                  <button className="w-12 h-12 rounded-full bg-orange-600 hover:bg-orange-300 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold pb-2">
                      +
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* Contenedor de Tareas Pendientes */}
          {tasks.length > 0 ? (
            <div className="bg-white rounded-[50px] p-6 mb-6 break-inside">
              <h2 className="text-xl md:text-2xl text-gray-600 font-bold mb-2 md:mb-6">
                Mis tareas
              </h2>
              <ul className="list-none list-inside">
                {tasks.map((task, index) => (
                  <li
                    key={index}
                    className="text-gray-800 border-b border-indigo-300 py-2 flex items-center"
                  >
                    <i className="fa-regular fa-square mr-2"></i>
                    {task.name}
                  </li>
                ))}
              </ul>
              <div className="bottom-4 right-4 mt-2 flex justify-end">
                <Link to="/tasks">
                  <button className="w-12 h-12 rounded-full bg-orange-600 hover:bg-orange-300 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold pb-2">
                      +
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[50px] p-6 mb-6 break-inside">
              <h2 className="text-xl md:text-2xl text-gray-600 font-bold mb-2 md:mb-6">
                Mis tareas
              </h2>
              <ul className="list-none list-inside">
                <li className="text-gray-800 border-b border-indigo-300 py-2 flex items-center">
                  <i className="fa-regular fa-square mr-2"></i>
                </li>
              </ul>
              <div className="bottom-4 right-4 mt-2 flex justify-end">
                <Link to="/tasks">
                  <button className="w-12 h-12 rounded-full bg-orange-600 hover:bg-orange-300 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold pb-2">
                      +
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* Contenedor de Últimas Entradas del Blog */}
          {store.home_id !== "null" ? (
            <div className="bg-white rounded-[50px] p-6 mb-6 break-inside">
              <h2 className="text-xl md:text-2xl text-gray-600 font-bold mb-2 md:mb-6">
                Actualizaciones
              </h2>
              <ul className="list-none list-inside">
                {blogEntries.map((entry, index) => (
                  <li
                    key={index}
                    className="text-gray-800 border-b border-indigo-300 py-2 flex items-center"
                  >
                    {entry.text}
                  </li>
                ))}
              </ul>
              <div className="bottom-4 right-4 mt-2 flex justify-end">
                <Link to="/blog">
                  <button className="w-12 h-12 rounded-full bg-orange-600 hover:bg-orange-300 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold pb-2">
                      +
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[50px] p-6 mb-6 break-inside">
              <h2 className="text-xl md:text-2xl text-gray-600 font-bold mb-2 md:mb-6">
                Actualizaciones
              </h2>
              <ul className="list-none list-inside">
                <li className="text-gray-800 border-b border-indigo-300 py-2 flex items-center"></li>
              </ul>
              <div className="bottom-4 right-4 mt-2 flex justify-end">
                <Link to="/blog">
                  <button className="w-12 h-12 rounded-full bg-orange-600 hover:bg-orange-300 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold pb-2">
                      +
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* Contenedor de Calendario Mensual */}
          {store.home_id !== "null" ? (
            <div className="bg-white rounded-[50px] p-6 mb-6 break-inside">
              <h2 className="text-xl md:text-2xl text-gray-600 font-bold mb-2 md:mb-6">
                Mi calendario
              </h2>
              <div style={{ height: 380 }}>
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  eventPropGetter={eventStyleGetter}
                  style={{ height: 380 }}
                  messages={{
                    next: "Sig",
                    previous: "Ant",
                    today: "Hoy",
                    month: "Mes",
                    week: "Semana",
                    day: "Día",
                    date: "Fecha",
                    time: "Hora",
                    event: "Evento",
                    noEventsInRange: "No hay eventos para estas fechas.",
                  }}
                />
              </div>
              <div className="bottom-4 right-4 mt-2 flex justify-end">
                <Link to="/calendar">
                  <button className="w-12 h-12 rounded-full bg-orange-600 hover:bg-orange-300 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold pb-2">
                      +
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[50px] p-6 mb-6 break-inside">
              <h2 className="text-xl md:text-2xl text-gray-600 font-bold mb-2 md:mb-6">
                Mi calendario
              </h2>
              <div style={{ height: 380 }}>
                <Calendar
                  localizer={localizer}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 380 }}
                  messages={{
                    next: "Sig",
                    previous: "Ant",
                    today: "Hoy",
                    month: "Mes",
                    week: "Semana",
                    day: "Día",
                    date: "Fecha",
                    time: "Hora",
                    event: "Evento",
                    noEventsInRange: "No hay eventos para estas fechas.",
                  }}
                />
              </div>
              <div className="bottom-4 right-4 mt-2 flex justify-end">
                <Link to="/calendar">
                  <button className="w-12 h-12 rounded-full bg-orange-600 hover:bg-orange-300 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold pb-2">
                      +
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Home;
