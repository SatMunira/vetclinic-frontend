import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';

const ArticlesPage = () => {
  const { user } = useContext(AuthContext);
  const [articles, setArticles] = useState([]);
  const baseUrl = "http://localhost:8080";

  const fixImageUrls = (html) => {
    return html.replace(/src="\/uploads\//g, `src="${baseUrl}/uploads/`);
  };


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
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📰 Статьи</h1>
        {user?.role === 'ROLE_ADMIN' && (
          <Link to="/articles/create">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
              ➕ Добавить статью
            </button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {articles.map(article => (
          <div key={article.id} className="bg-white shadow-md p-4 rounded-2xl">
            <h2 className="text-xl font-semibold mb-1">{article.title}</h2>
            <p className="text-sm text-gray-500 mb-2">
              {new Date(article.createdAt).toLocaleDateString()} • автор: {article.author.username}
            </p>
            <div
              className="text-gray-700 mb-2 prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: article.content.length > 200
                  ? fixImageUrls(article.content.slice(0, 200)) + '...'
                  : fixImageUrls(article.content)
              }}
            />

            <div className="flex justify-between items-center">
              <Link
                to={`/articles/${article.id}`}
                className="text-blue-600 hover:underline"
              >
                Читать далее
              </Link>
              {user?.role === 'ROLE_ADMIN' && (
                <button
                  className="text-red-600 hover:underline text-sm"
                  onClick={() => deleteArticle(article.id)}
                >
                  🗑 Удалить
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticlesPage;
