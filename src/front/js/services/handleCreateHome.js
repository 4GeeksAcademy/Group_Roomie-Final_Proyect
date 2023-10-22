export const handleCreateHome = (homeName) => {
  return fetch(`${process.env.REACT_APP_URL}/api/home`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: homeName }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error al crear el Home');
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      throw error;
    });
};
