import { apiRequest } from './client';
import { Location, RouteResponse } from '../types';

export async function getRoute(from: Location, to: Location): Promise<RouteResponse> {
  return apiRequest<RouteResponse>('/map/route', {
    method: 'POST',
    body: JSON.stringify({ from, to }),
  });
}