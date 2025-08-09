import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Map from '../components/Map';
import RideForm from '../components/RideForm';

const PassengerDashboard = () => {
  const [driverLocations, setDriverLocations] = useState<{ [key: string]: { lat: number; lng: number } }>({});

  useEffect(() => {
    const socket = io(`${import.meta.env.VITE_API_BASE_URL}/rides`, {
      auth: {
        token: localStorage.getItem('token'),
      },
    });

    socket.on('connect', () => {
      console.log('Conectado ao socket!');
    });

    socket.on('ride:accepted', (ride) => {
      console.log('Corrida aceita!', ride);
      // Lógica para mostrar o motorista no mapa
    });

    socket.on('ride:update', (ride) => {
      console.log('Status da corrida atualizado:', ride.status);
      // Lógica para atualizar o status da corrida
    });

    socket.on('driver:location', (data: { driverId: string; lat: number; lng: number }) => {
      setDriverLocations((prevLocations) => ({
        ...prevLocations,
        [data.driverId]: { lat: data.lat, lng: data.lng },
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="h-screen w-screen">
      <Map driverLocations={driverLocations} />
      <RideForm />
    </div>
  );
};

export default PassengerDashboard;
