'use client';
import React, { useEffect, useRef, useState } from 'react';
import { type Socket, io } from 'socket.io-client';
import { MyText } from './component/MyText';
import { OtherText } from './component/OtherText';
import type { Message } from './socket';

export function Content() {
  const socket = useRef<Socket>();
  const [inputText, setInputText] = useState('');
  const [userCount, setUserCount] = useState<number>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<string>();
  const screenAreaRef = useRef<HTMLDivElement>(null);
  const sendBtnRef = useRef<HTMLButtonElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  let process1 = new Promise((res, rej) => {
    if (messages.length > 1000) {
      setMessages(messages.slice(-500));
      res(true);
      return [...history, data];
    }
    else {
      res(true);
      return [...history, data];
    }
  });
  useEffect(() => {
    const client = io('http://26.148.236.50:8080/');

    client.on('updateUserCount', (data: { count: number }) => {
      const count = data.count;
      console.log('updateUserCount', count);
      setUserCount(count);
    });

    client.on('historyMessage', (data: Message[]) => {
      console.log('historyMessage', data);
      setMessages(data);
      // setTimeout(scrollToEnd, 10);
    });

    client.on('newMessage', async (data: Message) => {
      // if (screenAreaRef.current !== null) {
      //   if ((screenAreaRef.current?.scrollHeight - screenAreaRef.current?.scrollTop) < (screenAreaRef.current?.clientHeight + 50)) {
      //     setTimeout(scrollToEnd, 10);
      //   }
      // }
      setMessages((history) => {
        if (messages.length > 1000) {
          setMessages(messages.slice(-500));
          return [...history, data];
        }
        else {
          return [...history, data];
        }
      });
      // scrollToEnd();
    });
    client.on('usersInformation', (data: { nickname: string }[]) => {
      const userNickName = data[0].nickname;
      setUser(userNickName);
    });
    client.on('connect', () => {
      console.log('connected');
      client.emit('getHistoryMessage'); // 히스토리 요청
      client.emit('getUserCount'); // 총 접속유저 요청
      client.emit('getUsersInformation');
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
      // setTimeout(scrollToEnd, 10);
      // scrollToEnd();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.code === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if ((sendBtnRef.current !== null) && !event.nativeEvent.isComposing) {
        submitScrollToEnd();
      }
    }
  };

  const scrollToEnd = () => {
    const screen = screenAreaRef;
    if (screen.current !== null) {
      screen.current.scrollTop = screen.current.scrollHeight;
    }
  };
  useEffect(() => {
    scrollToEnd();
  }, [messages]);

  return (
    <>
      <div className="flex">
        현재 총 접속자
        {!userCount && <div>로딩중입니다.</div>}
        {userCount && <div>{userCount}</div>}
      </div>

      <div className="flex flex-col items-center p-10">
        <div
          ref={screenAreaRef}
          className="bg-slate-600 h-96 w-full overflow-scroll overflow-x-hidden flex flex-col p-5"
        >
          {/* displayed messages are limited to maximum 500element */}
          {messages.slice(-500).map((data: Message, i) => (data.nickname === user
            ? <MyText key={i} data={data} />
            : <OtherText key={i} data={data} />))}
        </div>
        <div className="w-full flex h-20">
          <textarea
            ref={textAreaRef}
            className="bg-red-200 w-full overflow-scroll overflow-x-hidden"
            onChange={(e) => { setInputText(e.target.value); }}
            value={inputText}
            onKeyDown={handleKeyDown}
          />

          <button
            ref={sendBtnRef}
            className="bg-red-800 w-32"
            onClick={submitScrollToEnd}
          >
            send

          </button>
        </div>
      </div>
    </>
  );
}

