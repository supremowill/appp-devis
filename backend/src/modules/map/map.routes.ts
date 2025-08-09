import { Router } from 'express';
import { mapController } from './map.controller';

const mapRoutes = Router();

mapRoutes.post('/directions', mapController.getDirections);
mapRoutes.post('/geocode', mapController.geocode);

export default mapRoutes;
