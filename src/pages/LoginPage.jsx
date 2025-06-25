import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosConfig';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { username, password });
      const token = res.data.token;
      const payload = JSON.parse(atob(token.split('.')[1]));
      login(token, { username: payload.sub, role: payload.role });
    } catch (err) {
      setError('Неверный логин или пароль');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-24 p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Вход</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          placeholder="Имя пользователя"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          autoComplete="current-password"
        />
        {error && (
          <p className="text-red-600 text-sm animate-pulse">{error}</p>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition duration-200"
        >
          Войти
        </button>
      </form>

      <p className="mt-6 text-center text-gray-600">
        Нет аккаунта?{' '}
        <Link to="/register" className="text-blue-600 hover:underline">
          Регистрация
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
