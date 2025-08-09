import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { initMap } from '../lib/mapbox';

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(-46.6333);
  const [lat, setLat] = useState(-23.5505);
  const [zoom, setZoom] = useState(12);

  useEffect(() => {
    if (map.current || !mapContainer.current) return; // initialize map only once
    map.current = initMap(mapContainer.current.id, [lng, lat], zoom);
  });

  return (
    <div ref={mapContainer} id="map-container" className="h-full w-full" />
  );
};

export default Map;
