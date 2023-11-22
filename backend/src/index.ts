import { Server } from 'socket.io';

async function main() {
  const io = new Server({
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log('a user connected');

    const count = io.sockets.sockets.size;
    socket.emit('updateUserCount', count);
  });

  io.on('disconnect', () => {
    console.log('a user disconnected');
  });

  io.listen(8080);
  console.log('hello world');
}

main();
