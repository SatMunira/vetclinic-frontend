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
      <h2>Коллективная вакцинация</h2>

      <h3>Доступные кампании</h3>
      <ul>
        {campaigns.map(c => (
          <li key={c.id}>
            💉 {c.vaccineName} – 📅 {new Date(c.date).toLocaleString()} – 🪑 Мест: {c.availableSlots}
            <br />
            <input
              type="number"
              min="1"
              max={c.availableSlots}
              value={selectedCampaign === c.id ? animalCount : 1}
              onFocus={() => setSelectedCampaign(c.id)}
              onChange={e => setAnimalCount(Number(e.target.value))}
              style={{ width: '50px', marginRight: '10px' }}
            />
            <button onClick={() => register(c.id)}>Записаться</button>
          </li>
        ))}
      </ul>

      <h3>Мои заявки</h3>
      <ul>
        {registrations.map(r => (
          <li key={r.id}>
            💉 {r.campaign.vaccineName} – 📅 {new Date(r.campaign.date).toLocaleString()} – 🐾 {r.animalCount} животных
            <button style={{ marginLeft: '10px' }} onClick={() => cancel(r.id)}>Отменить</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VaccinationPage;
