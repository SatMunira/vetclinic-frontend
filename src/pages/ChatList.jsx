import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const ChatList = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await api.get('/chat/contacts');
        if (res.data.length > 0) {
          setContacts(res.data);
        } else {
          const alt = await api.get('/chat/available');
          setContacts(alt.data);
        }
      } catch (err) {
        console.error('Ошибка загрузки контактов', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const openChat = (id) => {
    navigate(`/chat/${id}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Список чатов</h2>
      {loading ? (
        <p>Загрузка...</p>
      ) : contacts.length === 0 ? (
        <p>Нет доступных пользователей для чата</p>
      ) : (
        <ul>
          {contacts.map((user) => (
            <li key={user.id}>
              <button onClick={() => openChat(user.id)}>
                💬 {user.username}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatList;
