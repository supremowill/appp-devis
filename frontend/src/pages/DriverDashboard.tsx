import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Map from '../components/Map';
import DriverList from '../components/DriverList';

const DriverDashboard = () => {
  const [rides, setRides] = useState<any[]>([]);

  useEffect(() => {
    const socket = io(`${import.meta.env.VITE_API_BASE_URL}/rides`, {
      auth: {
        token: localStorage.getItem('token'),
      },
    });

    socket.on('connect', () => {
      console.log('Conectado ao socket!');
    });

    socket.on('ride:requested', (ride) => {
      console.log('Nova corrida solicitada!', ride);
      setRides((prevRides) => [...prevRides, ride]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="h-screen w-screen">
      <Map />
      <DriverList rides={rides} />
    </div>
  );
};

export default DriverDashboard;
