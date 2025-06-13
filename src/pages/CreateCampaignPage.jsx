import React, { useState } from 'react';
import api from '../api/axiosConfig';

const CreateCampaignPage = () => {
  const [form, setForm] = useState({
    vaccineName: '',
    date: '',
    slots: ''
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
          slots: form.slots
        }
      });
      alert('Кампания создана');
      setForm({ vaccineName: '', date: '', slots: '' });
    } catch (err) {
      console.error('Ошибка создания кампании', err);
      alert('Ошибка');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Создать кампанию вакцинации</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="vaccineName"
          value={form.vaccineName}
          onChange={handleChange}
          placeholder="Название вакцины"
          required
        /><br />

        <input
          type="datetime-local"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        /><br />

        <input
          type="number"
          name="slots"
          value={form.slots}
          onChange={handleChange}
          placeholder="Количество слотов"
          required
        /><br />

        <button type="submit">Создать</button>
      </form>
    </div>
  );
};

export default CreateCampaignPage;
