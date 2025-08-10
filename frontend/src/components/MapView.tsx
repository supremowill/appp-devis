import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { initMap, addMarker, drawRoute, fitBounds } from '../lib/map';
import { Location } from '../types';

interface MapViewProps {
  center?: [number, number];
  zoom?: number;
  fromLocation?: Location | null;
  toLocation?: Location | null;
  route?: GeoJSON.LineString | null;
  className?: string;
}

export default function MapView({
  center = [-51.9253, -14.2401], // Centro do Brasil
  zoom = 4,
  fromLocation,
  toLocation,
  route,
  className = ''
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const fromMarker = useRef<mapboxgl.Marker | null>(null);
  const toMarker = useRef<mapboxgl.Marker | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;
    
    try {
      map.current = initMap('map-container', center, zoom);
    } catch (error) {
      console.warn('Mapbox not available, using fallback map');
      // Fallback: show a simple div with map-like appearance
      if (mapContainer.current) {
        mapContainer.current.innerHTML = `
          <div class="w-full h-full bg-gray-200 flex items-center justify-center">
            <div class="text-center text-gray-500">
              <div class="text-4xl mb-2">🗺️</div>
              <div>Mapa não disponível</div>
            </div>
          </div>
        `;
      }
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update markers and route
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    if (fromMarker.current) {
      fromMarker.current.remove();
      fromMarker.current = null;
    }
    if (toMarker.current) {
      toMarker.current.remove();
      toMarker.current = null;
    }

    const coordinates: [number, number][] = [];

    // Add from marker
    if (fromLocation) {
      fromMarker.current = addMarker(map.current, [fromLocation.lng, fromLocation.lat], {
        color: '#0A4AA6'
      });
      coordinates.push([fromLocation.lng, fromLocation.lat]);
    }

    // Add to marker
    if (toLocation) {
      toMarker.current = addMarker(map.current, [toLocation.lng, toLocation.lat], {
        color: '#FFD200'
      });
      coordinates.push([toLocation.lng, toLocation.lat]);
    }

    // Draw route
    if (route) {
      drawRoute(map.current, route);
    }

    // Fit bounds if we have coordinates
    if (coordinates.length > 0) {
      fitBounds(map.current, coordinates);
    }
  }, [fromLocation, toLocation, route]);

  return (
    <div 
      ref={mapContainer} 
      id="map-container" 
      className={`map-container ${className}`}
    />
  );
}