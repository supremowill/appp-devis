import { useState, useEffect } from 'react';
import Auth from './pages/Auth';
import PassengerDashboard from './pages/PassengerDashboard';
import DriverDashboard from './pages/DriverDashboard';

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null); // 'PASSENGER' or 'DRIVER'

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      // Em um app real, você decodificaria o token para obter o role
      // Por simplicidade, vamos assumir um role fixo ou um prompt
      const userRole = prompt("Qual é o seu papel? (PASSENGER/DRIVER)");
      setToken(storedToken);
      setRole(userRole);
    }
  }, []);

  if (!token) {
    return <Auth />;
  }

  if (role === 'PASSENGER') {
    return <PassengerDashboard />;
  }

  if (role === 'DRIVER') {
    return <DriverDashboard />;
  }

  return <div>Carregando...</div>;
}

export default App;
