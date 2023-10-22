const fetchRoomies = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_URL}/api/roomie`);
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error('Error al obtener la lista de roomies', error);
  }
  return [];
};
export default fetchRoomies;