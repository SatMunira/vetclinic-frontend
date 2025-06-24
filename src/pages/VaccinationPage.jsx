import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

const VaccinationPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [animalCount, setAnimalCount] = useState(1);

  useEffect(() => {
    fetchCampaigns();
    fetchRegistrations();
  }, []);

  const fetchCampaigns = async () => {
    const res = await api.get('/vaccination/campaigns');
    setCampaigns(res.data);
  };

  const fetchRegistrations = async () => {
    const res = await api.get('/vaccination/my-registrations');
    setRegistrations(res.data);
  };

  const register = async (campaignId) => {
    try {
      await api.post('/vaccination/register', null, {
        params: {
          campaignId,
          animalCount
        }
      });
      setAnimalCount(1);
      fetchCampaigns();
      fetchRegistrations();
    } catch (err) {
      console.error('Ошибка записи:', err);
    }
  };

  const cancel = async (id) => {
    try {
      await api.delete(`/vaccination/my-registrations/${id}`);
      fetchCampaigns();
      fetchRegistrations();
    } catch (err) {
      console.error('Ошибка отмены:', err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div className="max-w-5xl mx-auto mt-10 p-6 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold mb-6 text-center">Коллективная вакцинация</h2>

        <h3 className="text-xl font-medium mb-4">Доступные кампании</h3>
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {campaigns.map(c => (
            <div
              key={c.id}
              className="border rounded-xl p-4 shadow hover:shadow-md transition"
            >
              <div className="text-lg font-semibold mb-1">💉 {c.vaccineName}</div>
              <div className="text-sm text-gray-600 mb-1">📅 {new Date(c.date).toLocaleString()}</div>
              <div className="text-sm text-gray-600 mb-1">📍 {c.description || 'Нет описания'}</div>
              <div className="text-sm text-gray-700 mb-3">🪑 Осталось мест: {c.availableSlots}</div>

              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  max={c.availableSlots}
                  value={selectedCampaign === c.id ? animalCount : 1}
                  onFocus={() => setSelectedCampaign(c.id)}
                  onChange={e => setAnimalCount(Number(e.target.value))}
                  className="w-20 border rounded-lg px-2 py-1 text-sm"
                />
                <button
                  onClick={() => register(c.id)}
                  className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition text-sm"
                >
                  Записаться
                </button>
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-medium mb-4">Мои заявки</h3>
        <ul className="space-y-3">
          {registrations.map(r => (
            <li
              key={r.id}
              className="bg-gray-50 border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between shadow-sm"
            >
              <div>
                <div className="font-medium">💉 {r.campaign.vaccineName}</div>
                <div className="text-sm text-gray-600">
                  📅 {new Date(r.campaign.date).toLocaleString()} – 🐾 {r.animalCount} животных
                </div>
              </div>
              <button
                onClick={() => cancel(r.id)}
                className="mt-2 md:mt-0 bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 transition text-sm"
              >
                Отменить
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

};

export default VaccinationPage;
