import { Router } from 'express';
import { ridesController } from './rides.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const ridesRoutes = Router();

ridesRoutes.use(authMiddleware);

ridesRoutes.post('/', ridesController.createRide);
ridesRoutes.get('/my', ridesController.getMyRides);
ridesRoutes.get('/:id', ridesController.getRideById);
ridesRoutes.post('/:id/accept', ridesController.acceptRide);
ridesRoutes.post('/:id/status', ridesController.updateRideStatus);

export default ridesRoutes;
