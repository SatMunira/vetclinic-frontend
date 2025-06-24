import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';

const CreateArticlePage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const fileInputRef = useRef(null);

  const editor = useEditor({
    extensions: [StarterKit, Underline, Image],
    content: '',
  });

  const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.url;  // <- здесь возвращается URL с backend
};

  const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file || !editor) return;

  try {
    const url = await uploadImage(file);  // получаем URL из backend
    editor.chain().focus().setImage({ src: url }).run();  // вставляем картинку по URL
    e.target.value = null; // чтобы можно было выбрать файл повторно
  } catch (err) {
    console.error('Ошибка загрузки изображения', err);
  }
};

  const insertImage = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editor) return;
    const content = editor.getHTML();
    if (!title.trim() || !content.trim()) return;

    try {
      await api.post('/articles', { title, content });
      navigate('/articles');
    } catch (err) {
      console.error('Ошибка создания статьи', err);
    }
  };

  // Чтобы не терять фокус и не пересоздавать редактор
  useEffect(() => {
    return () => editor?.destroy();
  }, [editor]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow space-y-6">
      <h1 className="text-2xl font-bold">➕ Новая статья</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Заголовок"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded-xl"
          required
        />

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <div className="border rounded-xl p-2">
          <div className="mb-2 flex gap-2">
            <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className="btn-style">B</button>
            <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className="btn-style">i</button>
            <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className="btn-style">U</button>
            <button type="button" onClick={insertImage} className="btn-style">🖼</button>
          </div>
          <EditorContent editor={editor} className="prose max-w-none min-h-[200px]" />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700">Опубликовать</button>
      </form>
    </div>
  );
};

export default CreateArticlePage;
