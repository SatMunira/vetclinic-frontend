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
      alert('Ошибка при создании кампании');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Создать кампанию вакцинации</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="vaccineName" className="block mb-2 text-sm font-medium text-gray-700">
              Название вакцины
            </label>
            <input
              type="text"
              id="vaccineName"
              name="vaccineName"
              value={form.vaccineName}
              onChange={handleChange}
              placeholder="Например, Вакцина-X"
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-700">
              Дата и время
            </label>
            <input
              type="datetime-local"
              id="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              step="600"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="slots" className="block mb-2 text-sm font-medium text-gray-700">
              Количество слотов
            </label>
            <input
              type="number"
              id="slots"
              name="slots"
              value={form.slots}
              onChange={handleChange}
              placeholder="Например, 25"
              required
              min="1"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-700">
              Описание / адрес
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Адрес, кабинет, доп. информация"
              rows={4}
              required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
          >
            Создать кампанию
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaignPage;
