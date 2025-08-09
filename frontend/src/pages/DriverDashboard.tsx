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

      // Emit driver location every 5 seconds
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          socket.emit('driver:location', {
            driverId: 'DRIVER_ID_PLACEHOLDER', // Replace with actual driver ID
            lat: latitude,
            lng: longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
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
