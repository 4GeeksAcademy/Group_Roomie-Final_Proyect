import React, { useState, useEffect } from "react";
import authBlog from "./authBlog";

const Blog = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");

    const fetchNotifications = async () => {
      try {
        const notificationsData = await authBlog.getNotificationsForUser(userId);
        setNotifications(notificationsData);
      } catch (error) {
        console.error("Error al obtener las notificaciones:", error);
      }
    };

    fetchNotifications();
  }, []);

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full sm:w-70 p-4 bg-white rounded-lg overflow-y-scroll">
        <h2 className="text-2xl font-bold text-center mb-6">Lista de Notificaciones</h2>
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className="flex items-center justify-between border-b pb-2 p-4 bg-white bg-opacity-70 rounded-lg"
            >
              <div>
                <p className="text-gray-800">
                  Notificación: {notification.text}
                </p>
                <p className="text-gray-600">
                  Fecha: {formatDate(notification.date)}
                </p>
                <p className="text-gray-600">
                  Asignado a: {notification.roomie_name}
                </p>
              </div>
              <div>
                {notification.isExpired ? (
                  <p className="text-gray-400 line-through">Caducada</p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Blog;