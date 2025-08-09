import mapboxgl from 'mapbox-gl';

export function initMap(containerId: string, center: [number, number], zoom = 13) {
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;
  const map = new mapboxgl.Map({
    container: containerId,
    style: 'mapbox://styles/mapbox/streets-v12',
    center,
    zoom
  });
  map.addControl(new mapboxgl.NavigationControl());
  return map;
}
