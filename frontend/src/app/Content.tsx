'use client';
import React, { type ReactNode, useEffect, useRef, useState } from 'react';
import { type Socket, io } from 'socket.io-client';
import MyText from './mytext';
import OtherText from './othertext';
import type Message from './socket';

export function Content() {
  const socket = useRef<Socket>();
  const [inputText, setInputText] = useState('');
  const [userCount, setUserCount] = useState<number>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<string>();
  const screenArea = useRef<HTMLDivElement>(null);
  const sendBtn = useRef<HTMLButtonElement>(null);
  const textArea = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const client = io('http://localhost:8080');

    client.on('updateUserCount', (data: { count: number }) => {
      const count: number = data.count;
      console.log('updateUserCount', count);
      setUserCount(count);
    });

    client.on('historyMessage', (data: Message[]) => {
      console.log('historyMessage', data);
      setMessages(data);
    });

    client.on('newMessage', (data: Message) => {
      setMessages((history) => {
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

  const submitScrollToEnd = () => {
    if (socket.current) {
      socket.current.emit('message', { text: inputText });
      setInputText('');
      setTimeout(() => {
        const screen = screenArea;
        if (screen.current !== null) {
          screen.current.scrollTop = screen.current.scrollHeight;
        }
      }, 10);
    }
  };

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.code === 'Enter') {
      if (!event.shiftKey) {
        event.preventDefault();
        if (sendBtn.current !== null) {
          sendBtn.current.click();
        }
      }
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
        <div ref={screenArea} className="bg-slate-600 h-96 w-full overflow-scroll overflow-x-hidden flex flex-col p-5">
          {/* displayed messages are limited to maximum 500element */}
          {messages.slice(-500).map((data: Message, i) => data.nickname === user
            ? <MyText key={i} data={data} />
            : <OtherText key={i} data={data} />)}
        </div>
        <div className="w-full flex h-20">
          <textarea
            ref={textArea}
            className="bg-red-200 w-full overflow-scroll overflow-x-hidden"
            onChange={(e) => { setInputText(e.target.value); }}
            value={inputText}
            onKeyDown={handleKeyDown}
          />

          <button
            ref={sendBtn}
            className="bg-red-800 w-32"
            onClick={submitScrollToEnd}
          >
            send

          </button>
        </div>
      </div>
    </main>
  );
}

