const getRoomies = () => {
    return fetch('https://supreme-eureka-xjq6457pjwv3gg4-3001.app.github.dev/api/roomie', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('No se pudo obtener la lista de roomies');
        }
        return response.json();
      })
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error('Error al obtener la lista de roomies:', error);
        throw error;
      });
  };
  
  const roomieService = {
    getRoomies,
  };
  
  export default roomieService;