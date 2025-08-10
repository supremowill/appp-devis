import { apiRequest } from './client';
import { Driver, RatingRequest, RatingResponse } from '../types';

export async function getDriver(id: string): Promise<Driver> {
  return apiRequest<Driver>(`/drivers/${id}`);
}

export async function rateDriver(id: string, rating: RatingRequest): Promise<RatingResponse> {
  return apiRequest<RatingResponse>(`/drivers/${id}/rate`, {
    method: 'POST',
    body: JSON.stringify(rating),
  });
}