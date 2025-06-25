import React, { useEffect, useState, useContext, useRef } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';

const ChatRoom = ({ receiverId }) => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/chat/with/${receiverId}`);
      setMessages(res.data);
    } catch (err) {
      console.error('Ошибка загрузки сообщений', err);
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) return;
    try {
      await api.post(`/chat/send`, null, {
        params: {
          receiverId,
          content: text,
        },
      });
      setText('');
      fetchMessages();
    } catch (err) {
      console.error('Ошибка отправки', err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [receiverId]);

  // Автопрокрутка вниз при обновлении сообщений
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md flex flex-col h-[500px]">
      <h2 className="text-xl font-semibold mb-4">Чат</h2>

      <div className="flex-1 overflow-y-auto mb-4 space-y-3">
        {messages.map(msg => {
          const isMine = Number(msg.sender.id) === Number(user.id);
          return (
            <div
              key={msg.id}
              className={`max-w-[70%] p-3 rounded-lg ${isMine ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-gray-900 self-start'}`}
            >
              <div className="font-semibold mb-1">{msg.sender.username}</div>
              <div>{msg.content}</div>
              <div className="text-xs text-gray-300 mt-1 text-right">{new Date(msg.timestamp).toLocaleString()}</div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Введите сообщение..."
          className="flex-grow border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-5 rounded-lg hover:bg-blue-700 transition"
          disabled={!text.trim()}
        >
          Отправить
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
