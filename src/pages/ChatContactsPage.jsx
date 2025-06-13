import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const ChatContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const res = await api.get('/chat/contacts');
        setContacts(res.data);
      } catch (err) {
        console.error('Ошибка загрузки контактов', err);
      }
    };

    loadContacts();
  }, []);

  const openChat = (id) => {
    navigate(`/chat/${id}`);
  };

  return (
    <div>
      <h2>Ваши чаты</h2>
      <ul>
        {contacts.map(user => (
          <li key={user.id} onClick={() => openChat(user.id)} style={{ cursor: 'pointer' }}>
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatContactsPage;
