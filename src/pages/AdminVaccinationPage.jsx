import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { Dialog } from '@headlessui/react';

const AdminVaccinationPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [participants, setParticipants] = useState({});
  const [form, setForm] = useState({
    vaccineName: '',
    date: '',
    slots: '',
    description: ''
  });

  const fetchCampaigns = async () => {
    const res = await api.get('/vaccination/campaigns');
    setCampaigns(res.data);
  };

  const handleFormChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const createCampaign = async (e) => {
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
      setForm({ vaccineName: '', date: '', slots: '', description: '' });
      setOpenForm(false);
      fetchCampaigns();
    } catch (err) {
      console.error('Ошибка создания кампании', err);
    }
  };

  const fetchParticipants = async () => {
    const res = await api.get('/vaccination/registrations/all');
    const grouped = res.data.reduce((acc, reg) => {
      const campaignId = reg.campaign.id;
      if (!acc[campaignId]) acc[campaignId] = [];
      acc[campaignId].push(reg);
      return acc;
    }, {});
    setParticipants(grouped);
  };

  useEffect(() => {
    fetchCampaigns();
    fetchParticipants();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Кампании вакцинации</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          onClick={() => setOpenForm(true)}
        >
          ➕ Создать кампанию
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campaigns.map(c => (
          <div key={c.id} className="bg-white shadow-md p-4 rounded-2xl">
            <h2 className="text-xl font-semibold">{c.vaccineName}</h2>
            <p className="text-gray-600">📅 {new Date(c.date).toLocaleString()}</p>
            <p className="text-gray-500 mb-2">{c.description}</p>
            <p>🪑 Осталось мест: <strong>{c.availableSlots}</strong></p>
            <details className="mt-3">
              <summary className="cursor-pointer text-blue-600 hover:underline">👥 Участники</summary>
              <table className="w-full text-sm mt-2 border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-2 py-1">#</th>
                    <th className="border px-2 py-1">Клиент</th>
                    <th className="border px-2 py-1">Животных</th>
                  </tr>
                </thead>
                <tbody>
                  {participants[c.id]?.map((r, i) => (
                    <tr key={r.id}>
                      <td className="border px-2 py-1 text-center">{i + 1}</td>
                      <td className="border px-2 py-1">{r.client.username}</td>
                      <td className="border px-2 py-1 text-center">{r.animalCount}</td>
                    </tr>
                  )) || (
                    <tr>
                      <td colSpan="3" className="text-center py-2">Нет записей</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </details>
          </div>
        ))}
      </div>

      <Dialog open={openForm} onClose={() => setOpenForm(false)} className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-40">
        <Dialog.Panel className="bg-white p-6 rounded-2xl max-w-md w-full">
          <Dialog.Title className="text-lg font-semibold mb-4">Новая кампания</Dialog.Title>
          <form onSubmit={createCampaign} className="space-y-4">
            <input
              type="text"
              name="vaccineName"
              placeholder="Название вакцины"
              value={form.vaccineName}
              onChange={handleFormChange}
              className="w-full border px-3 py-2 rounded-xl"
              required
            />
            <input
              type="datetime-local"
              name="date"
              step="600"
              value={form.date}
              onChange={handleFormChange}
              className="w-full border px-3 py-2 rounded-xl"
              required
            />
            <input
              type="number"
              name="slots"
              placeholder="Количество слотов"
              value={form.slots}
              onChange={handleFormChange}
              className="w-full border px-3 py-2 rounded-xl"
              required
            />
            <textarea
              name="description"
              placeholder="Описание / адрес"
              value={form.description}
              onChange={handleFormChange}
              className="w-full border px-3 py-2 rounded-xl"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setOpenForm(false)} className="px-4 py-2 bg-gray-200 rounded-xl">Отмена</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">Создать</button>
            </div>
          </form>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
};

export default AdminVaccinationPage;
