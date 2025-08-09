import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import axios from 'axios';

const prisma = new PrismaClient();

const MAPBOX_DIRECTIONS_API_BASE_URL = 'https://api.mapbox.com/directions/v5/mapbox/driving';
const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;
const BASE_PRICE_PER_KM = 2.5; // R$ 2.50 por km
const BASE_FARE = 5.0; // R$ 5.00 de taxa fixa

const createRideSchema = z.object({
  passengerId: z.string(),
  originLat: z.number(),
  originLng: z.number(),
  destLat: z.number(),
  destLng: z.number(),
});

const acceptRideSchema = z.object({
  driverId: z.string(),
});

const updateStatusSchema = z.object({
  status: z.enum([
    'REQUESTED',
    'ACCEPTED',
    'EN_ROUTE_TO_PASSENGER',
    'EN_ROUTE_TO_DESTINATION',
    'COMPLETED',
    'CANCELED',
  ]),
});

export const ridesService = {
  async createRide(data: unknown) {
    const validatedData = createRideSchema.parse(data);

    // Get distance and duration from Mapbox Directions API
    const url = `${MAPBOX_DIRECTIONS_API_BASE_URL}/${validatedData.originLng},${validatedData.originLat};${validatedData.destLng},${validatedData.destLat}`;
    const response = await axios.get(url, {
      params: {
        geometries: 'geojson',
        access_token: MAPBOX_TOKEN,
      },
    });

    const route = response.data.routes[0];
    const distanceKm = route.distance / 1000; // meters to kilometers
    const durationMin = route.duration / 60; // seconds to minutes

    const price = (distanceKm * BASE_PRICE_PER_KM) + BASE_FARE;

    const ride = await prisma.ride.create({
      data: {
        ...validatedData,
        distanceKm,
        durationMin,
        price,
      },
    });
    return ride;
  },

  async acceptRide(rideId: string, data: unknown) {
    const { driverId } = acceptRideSchema.parse(data);

    const ride = await prisma.ride.findUnique({ where: { id: rideId } });
    if (!ride) {
      throw new Error('Ride not found');
    }
    if (ride.status !== 'REQUESTED') {
      throw new Error('Ride status is not REQUESTED');
    }

    const updatedRide = await prisma.ride.update({
      where: { id: rideId },
      data: { driverId, status: 'ACCEPTED' },
    });
    return updatedRide;
  },

  async updateRideStatus(rideId: string, data: unknown) {
    const { status } = updateStatusSchema.parse(data);
    const ride = await prisma.ride.update({
      where: { id: rideId },
      data: { status },
    });
    return ride;
  },

  async getRideById(rideId: string) {
    const ride = await prisma.ride.findUnique({ where: { id: rideId } });
    return ride;
  },

  async getMyRides(userId: string, role: string) {
    const rides = await prisma.ride.findMany({
      where: {
        ...(role === 'PASSENGER' ? { passengerId: userId } : { driverId: userId }),
      },
    });
    return rides;
  },
};
