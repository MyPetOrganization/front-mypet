import useSocket from '@/hooks/useSockets';
import React, { useState, useEffect } from 'react';
import { Input, Button } from 'rsuite';

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'them';
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const socket = useSocket('http://localhost:3001');

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log('Connected to WebSocket server');
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
      });

      socket.on('event_message', (payload: { message: string; username: string }) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { id: Date.now(), text: payload.message, sender: 'me' },
        ]);
      });
    }

    return () => {
      if (socket) {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('event_message');
      }
    };
  }, [socket]);

  const handleSend = () => {
    if (newMessage.trim() !== '' && socket) {
      const message = { message: newMessage, username: 'them' };
      socket.emit('event_message', message);
      // setMessages([...messages, { id: Date.now(), text: newMessage, sender: 'them' }]);
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-[85vh] p-4 bg-gray-100 max-w-md mx-auto shadow-md rounded-md">
      <div className="flex-grow overflow-y-auto p-4 bg-white rounded-md">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-2 p-2 rounded-md max-w-xs ${message.sender === 'me' ? 'bg-gray-200 ml-auto' : 'bg-green-200 mr-auto'}`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center">
        <Input
          className="flex-grow"
          value={newMessage}
          onChange={(value: string) => setNewMessage(value)}
          placeholder="Type a message"
        />
        <Button appearance="primary" className="ml-2" onClick={handleSend}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatPage;