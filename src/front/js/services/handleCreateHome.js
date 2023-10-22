export const handleCreateHome = async (homeName) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_URL}/api/home`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: homeName }),
    });
    if (!response.ok) {
      throw new Error('Error al crear el Home');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};
