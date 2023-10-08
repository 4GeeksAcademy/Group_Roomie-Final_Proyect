import React from 'react';

const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      
      const token = localStorage.getItem('token'); 

      if (token) {
        // Realizar la solicitud al backend para invalidar el token de sesión.
        await fetch('/api/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}` // Envía el token en el encabezado de autorización.
          },
          
        });

        // Limpia el token de sesión en el frontend.
        localStorage.removeItem('token');

    
        window.location.href = '/'; 
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default LogoutButton;