import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VetDashboardPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({}); // { petId: { diagnosis, treatment } }

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8080/api/appointments/vet', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(res.data);
      } catch (err) {
        console.error('Ошибка загрузки приёмов:', err);
      }
    };

    fetchAppointments();
  }, []);

  const handleChange = (petId, field, value) => {
    setFormData(prev => ({
      ...prev,
      [petId]: {
        ...prev[petId],
        [field]: value,
      },
    }));
  };

  const handleSave = async (petId) => {
    const data = formData[petId];
    if (!data) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8080/api/records',
        {
          petId,
          diagnosis: data.diagnosis,
          treatment: data.treatment,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Убираем завершённый приём
      setAppointments(prev => prev.filter(a => a.pet.id !== petId));

      // Очищаем форму
      setFormData(prev => {
        const newForm = { ...prev };
        delete newForm[petId];
        return newForm;
      });
    } catch (err) {
      console.error('Ошибка при сохранении:', err);
      alert('Ошибка при сохранении диагноза и лечения.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Приёмы врача</h2>

      {appointments.length === 0 ? (
        <p className="text-gray-600">Нет приёмов</p>
      ) : (
        <ul className="space-y-8">
          {appointments.map((appt) => (
            <li
              key={appt.id}
              className="bg-white p-6 rounded-lg shadow border border-gray-200"
            >
              <p>
                <strong>Дата:</strong>{' '}
                {new Date(appt.appointmentTime).toLocaleString()}
              </p>
              <p>
                <strong>Питомец:</strong> {appt.pet.name} ({appt.pet.species})
              </p>
              <p>
                <strong>Клиент:</strong> {appt.client.username}
              </p>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor={`diagnosis-${appt.pet.id}`}
                    className="block mb-1 font-medium"
                  >
                    Диагноз
                  </label>
                  <input
                    id={`diagnosis-${appt.pet.id}`}
                    type="text"
                    value={formData[appt.pet.id]?.diagnosis || ''}
                    onChange={(e) =>
                      handleChange(appt.pet.id, 'diagnosis', e.target.value)
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Введите диагноз"
                  />
                </div>

                <div>
                  <label
                    htmlFor={`treatment-${appt.pet.id}`}
                    className="block mb-1 font-medium"
                  >
                    Лечение
                  </label>
                  <input
                    id={`treatment-${appt.pet.id}`}
                    type="text"
                    value={formData[appt.pet.id]?.treatment || ''}
                    onChange={(e) =>
                      handleChange(appt.pet.id, 'treatment', e.target.value)
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Введите лечение"
                  />
                </div>
              </div>

              <button
                onClick={() => handleSave(appt.pet.id)}
                className="mt-5 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded transition"
              >
                💾 Сохранить в медкарту
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VetDashboardPage;
