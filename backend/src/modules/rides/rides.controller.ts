import { Request, Response } from 'express';
import { ridesService } from './rides.service';
import { io } from '../../server';

export const ridesController = {
  async createRide(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const ride = await ridesService.createRide({ ...req.body, passengerId: req.user.id });
      // Emit to all drivers
      io.of('/rides').emit('ride:requested', ride);
      res.status(201).json(ride);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  async acceptRide(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const ride = await ridesService.acceptRide(req.params.id, { driverId: req.user.id });
      io.of('/rides').emit('ride:accepted', ride);
      res.status(200).json(ride);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  async updateRideStatus(req: Request, res: Response) {
    try {
      const ride = await ridesService.updateRideStatus(req.params.id, req.body);
      io.of('/rides').emit('ride:update', ride);
      res.status(200).json(ride);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  async getRideById(req: Request, res: Response) {
    try {
      const ride = await ridesService.getRideById(req.params.id);
      res.status(200).json(ride);
    } catch (error: any) {
      res.status(404).json({ message: 'Ride not found' });
    }
  },

  async getMyRides(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const rides = await ridesService.getMyRides(req.user.id, req.user.role);
      res.status(200).json(rides);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
};
