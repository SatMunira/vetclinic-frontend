import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';

const ChatRoom = ({ receiverId }) => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

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
      fetchMessages(); // обновляем после отправки
    } catch (err) {
      console.error('Ошибка отправки', err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [receiverId]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Чат</h2>
      <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '10px' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ textAlign: Number(msg.sender.id) === Number(user.id) ? 'right' : 'left' }}>
            <strong>{msg.sender.username}</strong>: {msg.content}
            <div style={{ fontSize: '0.8em', color: '#888' }}>{new Date(msg.timestamp).toLocaleString()}</div>
            <hr />
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Введите сообщение..."
          style={{ width: '70%' }}
        />
        <button onClick={sendMessage}>Отправить</button>
      </div>
    </div>
  );
};

export default ChatRoom;
