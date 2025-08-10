import { apiRequest } from './client';
import { GeocodeResponse } from '../types';

export async function geocodeAddress(query: string): Promise<GeocodeResponse> {
  return apiRequest<GeocodeResponse>('/map/geocode', {
    method: 'POST',
    body: JSON.stringify({ query }),
  });
}