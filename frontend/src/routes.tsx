import { createBrowserRouter } from 'react-router-dom';
import Splash from './pages/Splash';
import RequestRide from './pages/RequestRide';
import RateDriver from './pages/RateDriver';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Splash />,
  },
  {
    path: '/ride',
    element: <RequestRide />,
  },
  {
    path: '/rate',
    element: <RateDriver />,
  },
]);