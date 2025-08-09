import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

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
    const ride = await prisma.ride.create({ data: validatedData });
    return ride;
  },

  async acceptRide(rideId: string, data: unknown) {
    const { driverId } = acceptRideSchema.parse(data);
    const ride = await prisma.ride.update({
      where: { id: rideId },
      data: { driverId, status: 'ACCEPTED' },
    });
    return ride;
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
