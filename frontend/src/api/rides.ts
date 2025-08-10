import { apiRequest } from './client';
import { Location, PriceEstimate, Ride } from '../types';

export async function estimatePrice(distance: number, duration: number): Promise<PriceEstimate> {
  return apiRequest<PriceEstimate>('/rides/estimate', {
    method: 'POST',
    body: JSON.stringify({ distance, duration }),
  });
}

export async function createRide(from: Location, to: Location): Promise<Ride> {
  return apiRequest<Ride>('/rides', {
    method: 'POST',
    body: JSON.stringify({ from, to }),
  });
}