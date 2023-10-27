import React, { useState, useEffect } from "react";
import useAppContext from "../contexts/AppContext.jsx";
import Loader from "../component/Loader.jsx";

const Blog = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { actions, store } = useAppContext();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const notificationsData = await actions.getAllBlogsByHome(
          store.home_id
        );
        setNotifications(notificationsData || []);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener las notificaciones:", error);
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : store.home_id !== "null" ? (
        <>
          {Array.isArray(notifications) && notifications.length > 0 ? (
            <div className="flex items-center justify-center mt-5 sm:mt-20 md:mt-20 mx-2">
              <div className="bg-white rounded-[50px] p-4 md:p-8 w-full md:w-3/4 lg:w-3/5 xl:w-3/7">
                <h2 className="text-lg md:text-2xl text-gray-700 font-bold text-center mb-4 md:mb-6">
                  Últimas noticias en tu vivienda
                </h2>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-center mb-3 pb-2 border-b border-gray-300"
                  >
                    <i className="fa-regular fa-newspaper fa-lg text-indigo-300 mr-3"></i>
                    <p className="text-gray-800">
                      {formatDate(notification.date)}
                    </p>
                    <p className="text-gray-800 bg-indigo-300 rounded-xl ms-3 p-2 ">
                      {notification.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <h1 className="min-h-screen flex items-center justify-center text-center text-2xl font-bold tracking-tight text-gray-600 sm:text-4xl sm:p-4">
              Aún no hay actualizaciones en la vivienda
            </h1>
          )}
        </>
      ) : (
        <h1 className="min-h-screen flex items-center justify-center text-center text-2xl font-bold tracking-tight text-gray-600 sm:text-4xl sm:p-4">
          No estás vinculado a ninguna vivienda.
          <br />
          Crea una o pide a un administrador que te añada
        </h1>
      )}
    </>
  );
};

export default Blog;
