import { useEffect, useState } from 'react';
import getRoomies from '../services/getRoomies'; 

const UseRoomies = () => {
  const [roomies, setRoomies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getRoomies() 
      .then((data) => {
        setRoomies(data); 
        setLoading(false); 
      })
      .catch((err) => {
        setError(err); 
        setLoading(false); 
      });
  }, []);

  return { roomies, loading, error };
};

export default UseRoomies;
