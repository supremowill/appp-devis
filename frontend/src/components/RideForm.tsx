import { useState } from 'react';

const RideForm = () => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // 1. Geocode origin and destination
      const [originRes, destRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL}/map/geocode`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: origin }),
        }),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/map/geocode`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: destination }),
        }),
      ]);

      const [originData, destData] = await Promise.all([originRes.json(), destRes.json()]);

      if (!originData.features.length || !destData.features.length) {
        throw new Error('Não foi possível encontrar os endereços.');
      }

      const originCoords = originData.features[0].center;
      const destCoords = destData.features[0].center;

      // 2. Request the ride
      const rideResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/rides`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          originLat: originCoords[1],
          originLng: originCoords[0],
          destLat: destCoords[1],
          destLng: destCoords[0],
        }),
      });

      if (!rideResponse.ok) {
        const err = await rideResponse.json();
        throw new Error(err.message || 'Falha ao solicitar a corrida');
      }

      const ride = await rideResponse.json();
      console.log('Corrida solicitada:', ride);

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg w-80">
      <form onSubmit={handleSubmit}>
        <h2 className="text-lg font-bold mb-2">Solicitar uma corrida</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <div className="mb-2">
          <label htmlFor="origin" className="block text-sm font-medium text-gray-700">Origem</label>
          <input
            type="text"
            id="origin"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Digite o endereço de partida"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Destino</label>
          <input
            type="text"
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Digite o endereço de destino"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Solicitar Corrida
        </button>
      </form>
    </div>
  );
};

export default RideForm;
