import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes';
import mapRoutes from './modules/map/map.routes';
import ridesRoutes from './modules/rides/rides.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/map', mapRoutes);
app.use('/rides', ridesRoutes);

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

export default app;
