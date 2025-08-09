import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import Auth from './pages/Auth';
import PassengerDashboard from './pages/PassengerDashboard';
import DriverDashboard from './pages/DriverDashboard';

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null); // 'PASSENGER' or 'DRIVER'

  interface DecodedToken {
    role?: string;
  }

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decoded = jwtDecode<DecodedToken>(storedToken);
        if (decoded.role === 'PASSENGER' || decoded.role === 'DRIVER') {
          setToken(storedToken);
          setRole(decoded.role);
        } else {
          throw new Error('Invalid role');
        }
      } catch (err) {
        console.error('Invalid token', err);
        localStorage.removeItem('token');
        setToken(null);
        setRole(null);
      }
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
