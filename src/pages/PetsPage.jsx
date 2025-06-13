import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';

const PetsPage = () => {
    const { user } = useContext(AuthContext);
    const [pets, setPets] = useState([]);
    const [name, setName] = useState('');
    const [species, setSpecies] = useState('');

    const fetchPets = async () => {
        try {
            const res = await api.get('/pets'); // backend сам понимает, чей пользователь
            setPets(res.data);
        } catch (err) {
            console.error('Ошибка загрузки питомцев', err);
        }
    };

    const addPet = async (e) => {
        e.preventDefault();
        try {
            await api.post('/pets', { name, species }); // username брать не нужно, берётся из JWT
            setName('');
            setSpecies('');
            fetchPets();
        } catch (err) {
            console.error('Ошибка при добавлении питомца', err);
        }
    };

    useEffect(() => {
        if (user) {
            fetchPets();
        }
    }, [user]);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Мои питомцы</h2>

            <form onSubmit={addPet}>
                <input
                    type="text"
                    placeholder="Имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Вид"
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                    required
                />
                <button type="submit">Добавить</button>
            </form>

            <ul>
                {pets.map((pet) => (
                    <li key={pet.id}>
                        {pet.name} ({pet.species}) – <a href={`/pets/${pet.id}/records`}>Медкарта</a>
                    </li>
                ))}
            </ul>

        </div>
    );
};

export default PetsPage;
