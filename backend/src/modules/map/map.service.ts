import axios from 'axios';
import { z } from 'zod';
import { getMapboxToken } from '../../config/env';

const MAPBOX_API_BASE_URL = 'https://api.mapbox.com';

const directionsSchema = z.object({
  origin: z.object({
    lng: z.number(),
    lat: z.number(),
  }),
  destination: z.object({
    lng: z.number(),
    lat: z.number(),
  }),
});

const geocodeSchema = z.object({
  query: z.string().min(1),
});

export const mapService = {
  async getDirections(data: unknown) {
    const { origin, destination } = directionsSchema.parse(data);
    const url = `${MAPBOX_API_BASE_URL}/directions/v5/mapbox/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
    const token = getMapboxToken();

    const response = await axios.get(url, {
      params: {
        geometries: 'geojson',
        access_token: token,
      },
    });

    return response.data;
  },

  async geocode(data: unknown) {
    const { query } = geocodeSchema.parse(data);
    const url = `${MAPBOX_API_BASE_URL}/geocoding/v5/mapbox.places/${encodeURIComponent(
      query
    )}.json`;
    const token = getMapboxToken();

    const response = await axios.get(url, {
      params: {
        access_token: token,
        autocomplete: true,
      },
    });

    return response.data;
  },
};
