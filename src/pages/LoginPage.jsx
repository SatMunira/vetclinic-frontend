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
      const payload = JSON.parse(atob(token.split('.')[1])); // достаём данные из токена
      login(token, { username: payload.sub, role: payload.role }); // можно расширить
    } catch (err) {
      setError('Неверный логин или пароль');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', paddingTop: '100px' }}>
      <h2>Вход</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Войти</button>
      </form>
      <p>Нет аккаунта? <Link to="/register">Регистрация</Link></p>
    </div>
  );
};

export default LoginPage;
