'use client';
import { text } from 'stream/consumers';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { type Socket, io } from 'socket.io-client';
import janimal from './image/janimal.jpg';
import myungttak from './image/myungttak.jpg';
import MyText from './mytext';
import OtherText from './othertext';

interface Message {
  date: Date;
  nickname: string;
  text: string;
}

export function Content() {
  const socket = useRef<Socket>();
  const [inputText, setInputText] = useState('');
  const [userCount, setUserCount] = useState(null);
  const [history, setHistory] = useState([]);
  const [newMessage, setNewMessage] = useState({});
  useEffect(() => {
    const client = io('http://localhost:8080');

    client.on('updateUserCount', (data) => {
      const count: number = data.count;
      console.log('updateUserCount', count);
    });

    client.on('historyMessage', (data) => {
      console.log('historyMessage', data);
      setHistory(data);
    });

    client.on('newMessage', (data: Message) => {
      console.log('newMessage', data);
      setNewMessage(data);
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

      <div className="flex">
        현재 접속자
        {!userCount && <div>로딩중입니다.</div>}
        {userCount && <div>{userCount}</div>}
      </div>

      <div className="flex flex-col items-center p-10">
        <div className="bg-slate-600 h-96 w-full overflow-scroll overflow-x-hidden flex flex-col p-5">
          {history.map((data) => {
            <OtherText />
          })}

          <OtherText />
          <MyText />

        </div>
        <div className="w-full flex h-20">
          <textarea
            id="myTextArea"
            className="bg-red-200 w-full overflow-scroll overflow-x-hidden"
            onChange={(e) => {
              setInputText(e.target.value);
            }}
            value={inputText}
            onKeyDown={(e) => { handleKeyDown(e); }}
          />

          <button
            id="sendBtn"
            className="bg-red-800 w-32"
            onClick={() => {
              if (socket.current) {
                socket.current.emit('message', { text: inputText });
                setInputText('');
              }
            }}
          >
            send

          </button>
        </div>
      </div>
    </main>
  );
}

function handleKeyDown(event) {
  if (event.code === 'Enter') {
    if (!event.shiftKey) {
      event.preventDefault();
      document.getElementById('sendBtn')?.click();
    }
  }
}
