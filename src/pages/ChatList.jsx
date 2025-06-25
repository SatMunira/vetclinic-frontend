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
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Список чатов</h2>
      {loading ? (
        <p className="text-center text-gray-500">Загрузка...</p>
      ) : contacts.length === 0 ? (
        <p className="text-center text-gray-500">Нет доступных пользователей для чата</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {contacts.map((user) => (
            <li key={user.id} className="py-3">
              <button
                onClick={() => openChat(user.id)}
                className="w-full text-left px-4 py-2 rounded-lg hover:bg-blue-100 transition flex items-center gap-2"
                aria-label={`Открыть чат с ${user.username}`}
              >
                <span className="text-blue-600">💬</span>
                <span className="font-medium text-gray-900">{user.username}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatList;
