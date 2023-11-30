import http from 'http';
import { Server } from 'socket.io';

interface Message {
  date: Date;
  nickname: string;
  text: string;
}

const messages: Message[] = [];

async function main() {
  const server = http.createServer();

  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    // 중복 아이피 체크
    const ip = socket.handshake.address;

    for (const key of io.sockets.sockets.keys()) {
      if (socket.id === key) continue;

      const client = io.sockets.sockets.get(key);
      if (!client) continue;
      if (client.handshake.address !== ip) continue;

      client.emit('duplication');
      setTimeout(() => client.disconnect(), 3000);
    }

    console.log('a user connected');

    // 유저 접속 수 업데이트
    const count = io.sockets.sockets.size;
    socket.broadcast.emit('updateUserCount', {
      count,
    });

    socket.on('getUserCount', () => {
      socket.emit('updateUserCount', {
        count,
      });
    });

    // 채팅 히스토리 요청
    socket.on('getUserInformation', () => {
      // 아이피 가져오기
      const ip = socket.handshake.address;

      // ip 를 hash 로 변환
      const hash = ip
        .split('.')
        .map((v: string) => parseInt(v, 10).toString(16))
        .join('');
      socket.emit('userInformation', {
        nickname: `guest_${hash}`,
      });
    });

    // 채팅 히스토리 요청
    socket.on('getHistoryMessage', () => {
      socket.emit('historyMessage', messages);
    });

    // 새로운 메세지 전송
    socket.on('message', (data: any) => {
      if (!data) return;
      const { text } = data;

      if (typeof data.text !== 'string') return;

      // 아이피 가져오기
      const ip = socket.handshake.address;

      // ip 를 hash 로 변환
      const hash = ip
        .split('.')
        .map((v: string) => parseInt(v, 10).toString(16))
        .join('');

      const message: Message = {
        date: new Date(),
        nickname: `guest_${hash}`,
        text,
      };

      if (messages.length > 200) {
        messages.shift();
      }
      messages.push(message);
      socket.broadcast.emit('newMessage', message);
    });
  });

  io.on('disconnect', () => {
    console.log('a user disconnected');
  });

  server.listen(8080, '0.0.0.0', () => {
    console.log('Listening on 0.0.0.0:8080');
  });
  console.log('hello world');
}

main();
