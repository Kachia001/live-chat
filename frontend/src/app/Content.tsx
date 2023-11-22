'use client';
import { useEffect, useRef, useState } from 'react';
import { type Socket, io } from 'socket.io-client';

export function Content() {
  const socket = useRef<Socket>();

  const [userCount, setUserCount] = useState(null);
  useEffect(() => {
    const client = io('http://localhost:8080');

    client.on('updateUserCount', (data) => {
      console.log(1);
      console.log(data);
      setUserCount(data);
    });

    client.on('connect', () => {
      console.log('connected');
    });

    socket.current = client;
    return () => {
      client.disconnect();
    };
  }, []);
  return (
    <main className="">
      <nav className="text-start bg-black text-white p-3 font-bold flex justify-between">
        <h3 className="ms-3">liveChat</h3>
        <h3 className="me-3">menu</h3>
      </nav>

      <div className="flex">
        현재 접속자
        {!userCount && <div>로딩중입니다.</div>}
        {userCount && <div>{userCount}</div>}
      </div>
    </main>
  );
}
