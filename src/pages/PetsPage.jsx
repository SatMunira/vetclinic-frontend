import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';

const PetsPage = () => {
  const { user } = useContext(AuthContext);
  const [pets, setPets] = useState([]);
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const res = await api.get('/pets'); // backend сам понимает пользователя
      setPets(res.data);
    } catch (err) {
      console.error('Ошибка загрузки питомцев', err);
    } finally {
      setLoading(false);
    }
  };

  const addPet = async (e) => {
    e.preventDefault();
    if (!name.trim() || !species.trim()) return;
    try {
      await api.post('/pets', { name, species });
      setName('');
      setSpecies('');
      fetchPets();
    } catch (err) {
      console.error('Ошибка при добавлении питомца', err);
    }
  };

  useEffect(() => {
    if (user) fetchPets();
  }, [user]);

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-md mt-16">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Мои питомцы</h2>

      <form onSubmit={addPet} className="flex flex-col space-y-4 mb-6">
        <input
          type="text"
          placeholder="Имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Вид"
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
          required
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Добавить питомца
        </button>
      </form>

      {loading ? (
        <p className="text-center text-gray-500">Загрузка...</p>
      ) : pets.length === 0 ? (
        <p className="text-center text-gray-500">Питомцы не найдены</p>
      ) : (
        <ul className="space-y-3">
          {pets.map((pet) => (
            <li
              key={pet.id}
              className="flex justify-between items-center bg-gray-50 p-3 rounded-md shadow-sm"
            >
              <span className="text-gray-700 font-medium">
                {pet.name} ({pet.species})
              </span>
              <a
                href={`/pets/${pet.id}/records`}
                className="text-blue-600 hover:underline"
              >
                Медкарта
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PetsPage;
