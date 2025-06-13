import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';

const AppointmentsPage = () => {
  const { user } = useContext(AuthContext);
  const [pets, setPets] = useState([]);
  const [vets, setVets] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [form, setForm] = useState({
    petId: '',
    vetId: '',
    time: '',
    reason: ''
  });

  const loadData = async () => {
    try {
      const petRes = await api.get('/pets');
      const vetRes = await api.get('/users/vets');
      const appRes = await api.get('/appointments');
      setPets(petRes.data);
      setVets(vetRes.data);
      setAppointments(appRes.data);
    } catch (e) {
      console.error('Ошибка загрузки данных', e);
    }
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/appointments', form);
      setForm({ petId: '', vetId: '', time: '', reason: '' });
      loadData();
    } catch (err) {
      console.error('Ошибка при создании приёма', err);
    }
  };

  const cancelAppointment = async (id) => {
    try {
      await api.delete(`/appointments/${id}`);
      loadData();
    } catch (err) {
      console.error('Ошибка отмены', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">📋 Запись к ветеринару</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-6 space-y-5 border border-gray-100"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Питомец</label>
          <select
            name="petId"
            value={form.petId}
            onChange={handleChange}
            required
            className="w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Выберите питомца</option>
            {pets.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ветеринар</label>
          <select
            name="vetId"
            value={form.vetId}
            onChange={handleChange}
            required
            className="w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Выберите врача</option>
            {vets.map(v => (
              <option key={v.id} value={v.id}>{v.username}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Дата и время</label>
          <input
            type="datetime-local"
            name="time"
            value={form.time}
            onChange={handleChange}
            required
            className="w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Причина обращения</label>
          <input
            type="text"
            name="reason"
            placeholder="Например: осмотр, прививка"
            value={form.reason}
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
        >
          ✅ Записаться
        </button>
      </form>

      <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-800">📅 Мои записи</h2>

      <div className="space-y-4">
        {appointments.filter(a => !a.completed).map(app => (
          <div
            key={app.id}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col md:flex-row justify-between items-start md:items-center"
          >
            <div className="text-gray-800 space-y-1">
              <div><span className="font-semibold">🕓</span> {new Date(app.appointmentTime).toLocaleString()}</div>
              <div><span className="font-semibold">🐾</span> {app.pet.name}</div>
              <div><span className="font-semibold">👨‍⚕️</span> {app.vet.username}</div>
              <div><span className="font-semibold">📄</span> {app.reason || 'не указано'}</div>
            </div>
            <button
              onClick={() => cancelAppointment(app.id)}
              className="mt-4 md:mt-0 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-200"
            >
              Отменить
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentsPage;
