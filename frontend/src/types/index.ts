export interface Location {
  lng: number;
  lat: number;
}

export interface Place {
  place_name: string;
  center: [number, number]; // [lng, lat]
}

export interface GeocodeResponse {
  features: Place[];
}

export interface RouteResponse {
  distance: number; // in meters
  duration: number; // in seconds
  geometry: GeoJSON.LineString;
}

export interface PriceEstimate {
  price: number;
  currency: string;
}

export interface Ride {
  id: string;
  status: string;
  driver?: {
    id: string;
    name: string;
    rating: number;
    avatarUrl?: string;
  };
  from: Location;
  to: Location;
}

export interface Driver {
  id: string;
  name: string;
  rating: number;
  avatarUrl?: string;
}

export interface RatingRequest {
  stars: number;
  comment?: string;
}

export interface RatingResponse {
  ok: boolean;
}