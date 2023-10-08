import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();
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

    
        navigate('/'); 
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