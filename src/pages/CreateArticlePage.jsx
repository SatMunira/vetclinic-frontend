import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const CreateArticlePage = () => {
    const [form, setForm] = useState({ title: '', content: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/articles', {
                title: form.title,
                content: form.content
            });

            navigate('/articles');
        } catch (err) {
            console.error('Ошибка создания статьи', err);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>➕ Новая статья</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        name="title"
                        placeholder="Заголовок"
                        value={form.title}
                        onChange={handleChange}
                        required
                        style={{ width: '300px', marginBottom: '10px' }}
                    />
                </div>
                <div>
                    <textarea
                        name="content"
                        placeholder="Содержимое"
                        value={form.content}
                        onChange={handleChange}
                        required
                        style={{ width: '400px', height: '150px' }}
                    />
                </div>
                <button type="submit">Создать</button>
            </form>
        </div>
    );
};

export default CreateArticlePage;
