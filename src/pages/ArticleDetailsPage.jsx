import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const ArticleDetailsPage = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const navigate = useNavigate();
    const baseUrl = "http://localhost:8080";

    const fixImageUrls = (html) => {
        return html.replace(/src="\/uploads\//g, `src="${baseUrl}/uploads/`);
    };

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const res = await api.get(`/articles/${id}`);
                setArticle(res.data);
            } catch (err) {
                console.error('Ошибка загрузки статьи', err);
                navigate('/articles');
            }
        };
        fetchArticle();
    }, [id, navigate]);

    if (!article) return <div className="p-6">Загрузка...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow">
            <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
            <div className="text-sm text-gray-500 mb-4">
                📅 {new Date(article.createdAt).toLocaleDateString()} • 👤 {article.author.username}
            </div>
            <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: fixImageUrls(article.content) }}
            />

        </div>
    );
};

export default ArticleDetailsPage;
