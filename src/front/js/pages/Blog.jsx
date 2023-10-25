import React, { useState, useEffect } from "react";
import authBlog from "../services/authBlog";

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

  const markNotificationAsRead = async (notificationId) => {
    // Agrega la lógica para marcar una notificación como leída
    try {
      const response = await authBlog.markNotificationAsRead(notificationId);
      if (response) {
        // Actualizar el estado de la notificación como leída
        const updatedNotifications = notifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        );
        setNotifications(updatedNotifications);
      }
    } catch (error) {
      console.error("Error al marcar la notificación como leída:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full sm:w-70 p-4 bg-white rounded-lg overflow-y-scroll">
        <h2 className="text-2xl font-bold text-center mb-6">Lista de Notificaciones</h2>
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`${
                notification.isCurrentUser
                  ? "bg-green-100"
                  : "bg-white"
              } border-b pb-2 p-4 bg-opacity-70 rounded-lg cursor-pointer`}
              onClick={() => markNotificationAsRead(notification.id)}
            >
              <div>
                <p
                  className={`text-gray-800 ${
                    notification.isCurrentUser ? "text-green-500" : ""
                  }`}
                >
                  Notificación: {notification.text}
                </p>
                <p
                  className={`text-gray-600 ${
                    notification.isCurrentUser ? "text-green-500" : ""
                  }`}
                >
                  Fecha: {formatDate(notification.date)}
                </p>
                <p
                  className={`text-gray-600 ${
                    notification.isCurrentUser ? "text-green-500" : ""
                  }`}
                >
                  Asignado a: {notification.roomie_name}
                </p>
              </div>
              <div>
                {notification.isExpired ? (
                  <p className="text-gray-400 line-through">Caducada</p>
                ) : notification.isRead ? (
                  <p className="text-gray-400">Leída</p>
                ) : (
                  <p className="text-blue-500">Pendiente</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Blog;