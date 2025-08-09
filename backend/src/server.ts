import http from 'http';
import { Server } from 'socket.io';
import app from './app';

const port = process.env.PORT || 3001;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', // Em produção, restrinja para o domínio do frontend
    methods: ['GET', 'POST'],
  },
});

// Store driver locations in memory for now
const driverLocations = new Map<string, { lat: number; lng: number }>();

app.set('io', io);

io.of('/rides').on('connection', (socket) => {
  console.log('a user connected to /rides', socket.id);

  socket.on('driver:location', (data: { driverId: string; lat: number; lng: number }) => {
    driverLocations.set(data.driverId, { lat: data.lat, lng: data.lng });
    // Emit to all passengers (or specific passengers if a ride is active)
    socket.broadcast.emit('driver:location', data);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected from /rides', socket.id);
    // Remove driver from locations if they disconnect
    for (let [key, value] of driverLocations.entries()) {
      if (key === socket.id) {
        driverLocations.delete(key);
        break;
      }
    }
  });
});

server.listen(port, () => {
  console.log(`🚀 Server ready at: http://localhost:${port}`);
});

export { io };
