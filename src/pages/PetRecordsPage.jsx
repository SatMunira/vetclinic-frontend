import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PetRecordsPage = () => {
  const { id: petId } = useParams();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:8080/api/records/pet/${petId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecords(res.data);
      } catch (err) {
        setError('Ошибка при загрузке медкарты питомца');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, [petId]);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Медкарта питомца</h2>

      {loading && <p className="text-gray-500">Загрузка данных...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && records.length === 0 && (
        <p className="text-gray-600">Записи отсутствуют</p>
      )}

      <div className="space-y-6">
        {records.map((rec) => (
          <div key={rec.id} className="border border-gray-200 rounded-lg p-4 shadow-sm bg-gray-50">
            <p>
              <span className="font-semibold">Дата:</span>{' '}
              {new Date(rec.date).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">Диагноз:</span> {rec.diagnosis}
            </p>
            <p>
              <span className="font-semibold">Лечение:</span> {rec.treatment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PetRecordsPage;
