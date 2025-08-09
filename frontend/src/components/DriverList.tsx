interface Ride {
  id: string;
  originLat: number;
  originLng: number;
  destLat: number;
  destLng: number;
}

interface DriverListProps {
  rides: Ride[];
}

const DriverList = ({ rides }: DriverListProps) => {

  const handleAcceptRide = async (rideId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/rides/${rideId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Falha ao aceitar a corrida');
      }

      const ride = await response.json();
      console.log('Corrida aceita:', ride);

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg w-80">
      <h2 className="text-lg font-bold mb-2">Corridas Disponíveis</h2>
      {rides.length === 0 ? (
        <p>Nenhuma corrida disponível no momento.</p>
      ) : (
        <ul>
          {rides.map((ride) => (
            <li key={ride.id} className="mb-2 p-2 border rounded-md">
              <p>Origem: {ride.originLat}, {ride.originLng}</p>
              <p>Destino: {ride.destLat}, {ride.destLng}</p>
              <button 
                onClick={() => handleAcceptRide(ride.id)}
                className="w-full mt-2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Aceitar Corrida
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DriverList;
