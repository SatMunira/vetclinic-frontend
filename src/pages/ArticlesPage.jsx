import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';

const ArticlesPage = () => {
  const { user } = useContext(AuthContext);
  const [articles, setArticles] = useState([]);

  const fetchArticles = async () => {
    try {
      const res = await api.get('/articles');
      setArticles(res.data);
    } catch (err) {
      console.error('Ошибка загрузки статей', err);
    }
  };

  const deleteArticle = async (id) => {
    try {
      await api.delete(`/articles/${id}`);
      fetchArticles();
    } catch (err) {
      console.error('Ошибка удаления статьи', err);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>📰 Статьи</h2>
      {user?.role === 'ROLE_ADMIN' && (
        <div style={{ marginBottom: '20px' }}>
          <Link to="/articles/create">
            <button>➕ Добавить статью</button>
          </Link>
        </div>
      )}
      <ul>
        {articles.map(article => (
          <li key={article.id} style={{ marginBottom: '15px' }}>
            <h3>{article.title}</h3>
            <p>{article.content}</p>
            {user?.role === 'ROLE_ADMIN' && (
              <button onClick={() => deleteArticle(article.id)}>🗑 Удалить</button>
            )}
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArticlesPage;
