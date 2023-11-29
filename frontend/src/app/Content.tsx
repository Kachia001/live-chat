'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { type Socket, io } from 'socket.io-client';
import janimal from './image/janimal.jpg';
import myungttak from './image/myungttak.jpg';

interface Message {
  date: Date;
  nickname: string;
  text: string;
}

export function Content() {
  const socket = useRef<Socket>();

  const [userCount, setUserCount] = useState(null);
  useEffect(() => {
    const client = io('http://localhost:8080');

    client.on('updateUserCount', (data) => {
      const count: number = data.count;
      console.log('updateUserCount', count);
    });

    client.on('historyMessage', (data) => {
      console.log('historyMessage', data);
    });

    client.on('newMessage', (data: Message) => {
      console.log('newMessage', data);
    });

    client.on('connect', () => {
      console.log('connected');
      client.emit('getHistoryMessage'); // 히스토리 요청
      client.emit('getUserCount'); // 총 접속유저 요청

      setTimeout(() => {
        client.emit('message', {
          text: 'hello',
        });
      }, 2000);
    });

    client.on('duplication', () => {
      console.log('duplication');
    });

    client.on('disconnect', () => {
      console.log('disconnect');
    });

    client.on('close', () => {
      console.log('close');
    });

    socket.current = client;
    return () => {
      client.disconnect();
      client.close();
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

      <div className="flex flex-col items-center p-10">
        <div className="bg-slate-600 h-96 w-full overflow-scroll overflow-x-hidden flex flex-col p-5">

          <div className="text w-full h-fit flex">
            <div alt="img" className="w-1/12 h-16 bg-slate-50" />
            {/* <Image src={myungttak} alt='img' className="w-1/12 h-16" /> */}
            <span className="w-11/12 mx-10">aa</span>
          </div>
          <div className="text-end w-full h-fit flex">
            <span className="w-11/12 mx-10">aa</span>
            <div alt="img" className="w-1/12 h-16 bg-slate-50" />
            {/* <Image src={janimal} alt='img' className="w-1/12 h-16" /> */}
          </div>
        </div>
        <div className="w-full flex h-20">
          <textarea className="bg-red-200 w-full overflow-scroll overflow-x-hidden"></textarea>
          <button className="bg-red-800 w-32">send</button>
        </div>
      </div>
    </main>
  );
}
function Send() {
  return (
    <div>aa</div>
  );
}
