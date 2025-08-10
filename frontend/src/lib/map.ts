import mapboxgl from 'mapbox-gl';

export function initMap(containerId: string, center: [number, number], zoom = 13): mapboxgl.Map {
  const token = import.meta.env.VITE_MAPBOX_TOKEN;
  if (token) {
    mapboxgl.accessToken = token;
  }
  
  const map = new mapboxgl.Map({
    container: containerId,
    style: 'mapbox://styles/mapbox/streets-v12',
    center,
    zoom,
    attributionControl: false,
  });
  
  return map;
}

export function addMarker(
  map: mapboxgl.Map,
  coordinates: [number, number],
  options: { color?: string; element?: HTMLElement } = {}
): mapboxgl.Marker {
  const marker = new mapboxgl.Marker({
    color: options.color || '#0A4AA6',
    element: options.element,
  })
    .setLngLat(coordinates)
    .addTo(map);
    
  return marker;
}

export function drawRoute(map: mapboxgl.Map, geometry: GeoJSON.LineString): void {
  // Remove existing route
  if (map.getSource('route')) {
    map.removeLayer('route');
    map.removeSource('route');
  }
  
  map.addSource('route', {
    type: 'geojson',
    data: {
      type: 'Feature',
      properties: {},
      geometry,
    },
  });
  
  map.addLayer({
    id: 'route',
    type: 'line',
    source: 'route',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': '#0A4AA6',
      'line-width': 4,
    },
  });
}

export function fitBounds(map: mapboxgl.Map, coordinates: [number, number][]): void {
  const bounds = new mapboxgl.LngLatBounds();
  coordinates.forEach(coord => bounds.extend(coord));
  
  map.fitBounds(bounds, {
    padding: 50,
    maxZoom: 15,
  });
}