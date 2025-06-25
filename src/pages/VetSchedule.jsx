import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const VetSchedule = ({ vetId, onSelectSlot }) => {
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('');

  useEffect(() => {
    if (!date) return;
    setLoading(true);
    api.get(`/vet/${vetId}/schedule`, { params: { date } })
      .then(res => setSlots(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [date, vetId]);

  return (
    <div>
      <label>Выберите дату:</label>
      <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      {loading && <p>Загрузка...</p>}
      {!loading && slots.length === 0 && date && <p>Свободных слотов нет</p>}
      <div>
        {slots.map(slot => (
          <button
            key={slot}
            onClick={() => {
              setSelectedSlot(slot);
              onSelectSlot(slot);
            }}
            style={{
              margin: '0 5px 5px 0',
              backgroundColor: slot === selectedSlot ? 'green' : 'gray',
              color: 'white',
              padding: '5px 10px',
              borderRadius: '5px',
            }}
          >
            {slot}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VetSchedule;
