import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Добро пожаловать, {user?.username}!</h2>
      <p className="mb-6 text-gray-600">Роль: <span className="font-medium">{user?.role.replace('ROLE_', '')}</span></p>

      {user?.role === 'ROLE_CLIENT' && (
        <nav className="mb-6">
          <ul className="space-y-3">
            <li>
              <Link to="/pets" className="text-blue-600 hover:underline">
                🐾 Мои питомцы
              </Link>
            </li>
            <li>
              <Link to="/appointments" className="text-blue-600 hover:underline">
                📋 Запись к врачу
              </Link>
            </li>
            <li>
              <Link to="/vaccinations" className="text-blue-600 hover:underline">
                💉 Коллективная вакцинация
              </Link>
            </li>
            <li>
              <Link to="/pharmacy" className="text-blue-600 hover:underline">
                💊 Аптека
              </Link>
            </li>
            <li>
              <Link to="/chat" className="text-blue-600 hover:underline">
                💬 Чат с врачом
              </Link>
            </li>
            <li>
              <Link to="/articles" className="text-blue-600 hover:underline">
                📚 Статьи
              </Link>
            </li>
          </ul>
        </nav>
      )}

      {user?.role === 'ROLE_VET' && (
        <nav className="mb-6">
          <ul className="space-y-3">
            <li>
              <Link to="/vet" className="text-green-600 hover:underline font-semibold">
                👨‍⚕️ Панель врача
              </Link>
            </li>
            <li>
              <Link to="/chat" className="text-green-600 hover:underline font-semibold">
                💬 Чат с клиентами
              </Link>
            </li>
          </ul>
        </nav>
      )}

      {user?.role === 'ROLE_ADMIN' && (
        <nav className="mb-6">
          <ul className="space-y-3">
            <li>
              <Link to="/admin/vaccination" className="text-red-600 hover:underline font-semibold">
                🩺 Кампании вакцинации
              </Link>
            </li>
            <li>
              <Link to="/articles" className="text-red-600 hover:underline font-semibold">
                📚 Все статьи
              </Link>
            </li>
            <li>
              <Link to="/articles/create" className="text-red-600 hover:underline font-semibold">
                ➕ Добавить статью
              </Link>
            </li>
            <li>
              <Link to="/pharmacy" className="text-red-600 hover:underline font-semibold">
                💊 Аптека
              </Link>
            </li>
          </ul>
        </nav>
      )}

      <button
        onClick={logout}
        className="mt-6 w-full py-2 px-4 bg-gray-700 hover:bg-gray-800 text-white rounded-md transition"
      >
        Выйти
      </button>
    </div>
  );
};

export default DashboardPage;
