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
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Ваши чаты</h2>
      <ul className="divide-y divide-gray-200">
        {contacts.map(user => (
          <li
            key={user.id}
            onClick={() => openChat(user.id)}
            className="cursor-pointer px-4 py-3 hover:bg-blue-100 rounded transition"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') openChat(user.id); }}
          >
            <span className="text-gray-900 font-medium">{user.username}</span>
          </li>
        ))}
        {contacts.length === 0 && (
          <li className="text-center text-gray-500 py-4">Нет доступных контактов</li>
        )}
      </ul>
    </div>
  );
};

export default ChatContactsPage;
