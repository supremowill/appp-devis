import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { initMap } from '../lib/mapbox';

interface MapProps {
  driverLocations?: { [key: string]: { lat: number; lng: number } };
}

const Map = ({ driverLocations }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const [lng, setLng] = useState(-46.6333);
  const [lat, setLat] = useState(-23.5505);
  const [zoom, setZoom] = useState(12);

  useEffect(() => {
    if (map.current || !mapContainer.current) return; // initialize map only once
    map.current = initMap(mapContainer.current.id, [lng, lat], zoom);
  });

  useEffect(() => {
    if (!map.current || !driverLocations) return;

    Object.entries(driverLocations).forEach(([driverId, location]) => {
      if (markers.current[driverId]) {
        markers.current[driverId].setLngLat([location.lng, location.lat]);
      } else {
        const el = document.createElement('div');
        el.className = 'driver-marker';
        el.style.backgroundImage = 'url(/driver-icon.png)'; // You'll need a driver icon
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.backgroundSize = '100%';

        markers.current[driverId] = new mapboxgl.Marker(el)
          .setLngLat([location.lng, location.lat])
          .addTo(map.current!);
      }
    });

    // Remove markers for drivers that are no longer in the list
    Object.keys(markers.current).forEach((driverId) => {
      if (!(driverId in driverLocations)) {
        markers.current[driverId].remove();
        delete markers.current[driverId];
      }
    });

  }, [driverLocations]);

  return (
    <div ref={mapContainer} id="map-container" className="h-full w-full" />
  );
};

export default Map;
