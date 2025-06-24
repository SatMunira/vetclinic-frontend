import React, { useState } from 'react';
import api from '../api/axiosConfig';

const CreateCampaignPage = () => {
  const [form, setForm] = useState({
    vaccineName: '',
    date: '',
    slots: '',
    description: ''
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/vaccination/campaign', null, {
        params: {
          vaccineName: form.vaccineName,
          date: form.date,
          slots: form.slots,
          description: form.description
        }
      });
      alert('Кампания создана');
      setForm({ vaccineName: '', date: '', slots: '', description: '' });
    } catch (err) {
      console.error('Ошибка создания кампании', err);
      alert('Ошибка');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <div className="bg-white shadow-xl rounded-2xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">Создать кампанию вакцинации</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Название вакцины</label>
            <input
              type="text"
              name="vaccineName"
              value={form.vaccineName}
              onChange={handleChange}
              placeholder="Например, Вакцина-X"
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Дата и время</label>
            <input
              type="datetime-local"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              step="600"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Количество слотов</label>
            <input
              type="number"
              name="slots"
              value={form.slots}
              onChange={handleChange}
              placeholder="Например, 25"
              required
              min="1"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Описание / адрес</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Адрес, кабинет, доп. информация"
              rows={4}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Создать кампанию
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaignPage;
