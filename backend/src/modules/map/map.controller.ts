import { Request, Response } from 'express';
import { mapService } from './map.service';

export const mapController = {
  async getDirections(req: Request, res: Response) {
    try {
      const directions = await mapService.getDirections(req.body);
      res.status(200).json(directions);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  async geocode(req: Request, res: Response) {
    try {
      const results = await mapService.geocode(req.body);
      res.status(200).json(results);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
};
