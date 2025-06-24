import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Добро пожаловать, {user?.username}!</h2>
            <p>Роль: {user?.role}</p>

            {user?.role === 'ROLE_CLIENT' && (
                <div>
                    <ul>
                        <li><Link to="/pets">Мои питомцы</Link></li>
                        <li><Link to="/appointments">Запись к врачу</Link></li>
                        <li><Link to="/vaccinations">Коллективная вакцинация</Link></li>
                        <li><Link to="/pharmacy">Аптека</Link></li>
                        <li><Link to="/chat">💬 Чат с врачом</Link></li> {/* 👈 добавлено */}
                        <li><Link to="/vaccinations">Коллективная вакцинация</Link></li>
                        <li><Link to="/articles">📚 Статьи</Link></li>


                    </ul>
                </div>
            )}

            {user?.role === 'ROLE_VET' && (
                <div>
                    <ul>
                        <li><Link to="/vet">Панель врача</Link></li>
                        <li><Link to="/chat">💬 Чат с клиентами</Link></li> {/* 👈 добавлено */}
                    </ul>
                </div>
            )}
            {user?.role === 'ROLE_ADMIN' && (
                <ul>
                    <li><Link to="/admin/vaccination">🩺 Кампании вакцинации</Link></li>
                    <li><Link to="/articles">📚 Все статьи</Link></li>
                    <li><Link to="/articles/create">➕ Добавить статью</Link></li>
                      <li><Link to="/pharmacy">💊 Аптека</Link></li> 
                </ul>
            )}

            <button onClick={logout}>Выйти</button>
        </div>
    );
};

export default DashboardPage;
