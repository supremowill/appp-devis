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

app.set('io', io);

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
  });
});

server.listen(port, () => {
  console.log(`🚀 Server ready at: http://localhost:${port}`);
});

export { io };
