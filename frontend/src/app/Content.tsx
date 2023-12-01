'use client';
import { text } from 'stream/consumers';
import Image from 'next/image';
import React, { type KeyboardEventHandler, useEffect, useRef, useState } from 'react';
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
  const [userCount, setUserCount] = useState<number>();
  const [history, setHistory] = useState<Message[]>([]);
  const [user, setUser] = useState<string>();
  useEffect(() => {
    const client = io('http://localhost:8080');

    client.on('updateUserCount', (data: { count: number }) => {
      const count: number = data.count;
      console.log('updateUserCount', count);
      setUserCount(count);
    });

    client.on('historyMessage', (data: Message[]) => {
      console.log('historyMessage', data);
      setHistory(data);
    });

    client.on('newMessage', (data: Message) => {
      setHistory((history) => {
        return [...history, data];
      });
    });
    client.on('usersInformation', (data: { nickname: string }[]) => {
      const userNickName = data[0].nickname;
      setUser(userNickName);
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
    socket.current.emit('getUsersInformation');
    return () => {
      client.disconnect();
      client.close();
    };
  }, []);

  function scrollToEnd() {
    if (socket.current) {
      socket.current.emit('message', { text: inputText });
      setInputText('');
      setTimeout(() => {
        const screen = document.getElementById('screen');
        if (screen !== null) {
          screen.scrollTop = screen.scrollHeight;
        }
      }, 10);
    }
  }

  return (
    <main className="">

      <div className="flex">
        현재 접속자
        {!userCount && <div>로딩중입니다.</div>}
        {userCount && <div>{userCount}</div>}
      </div>

      <div className="flex flex-col items-center p-10">
        <div id="screen" className="bg-slate-600 h-96 w-full overflow-scroll overflow-x-hidden flex flex-col p-5">
          {history.map((data: Message, i) => {
            if (data.nickname === user) { return (<MyText data={data} key={i} />); }
            else { return (<OtherText key={i} data={data} />); }
          })}
        </div>
        <div className="w-full flex h-20">
          <textarea
            id="myTextArea"
            className="bg-red-200 w-full overflow-scroll overflow-x-hidden"
            onChange={(e) => { setInputText(e.target.value); }}
            value={inputText}
            onKeyDown={handleKeyDown}
          />

          <button
            id="sendBtn"
            className="bg-red-800 w-32"
            onClick={scrollToEnd}
          >
            send

          </button>
        </div>
      </div>
    </main>
  );
}

function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
  if (event.code === 'Enter') {
    if (!event.shiftKey) {
      event.preventDefault();
      document.getElementById('sendBtn')?.click();
    }
  }
}
