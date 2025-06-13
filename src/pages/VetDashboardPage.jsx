import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VetDashboardPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [formData, setFormData] = useState({}); // по id питомца храним диагноз/лечение


    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:8080/api/appointments/vet', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
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
                [field]: value
            }
        }));
    };

    const handleSave = async (petId) => {
    const data = formData[petId];
    if (!data) return;

    try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:8080/api/records', {
            petId: petId,
            diagnosis: data.diagnosis,
            treatment: data.treatment
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        // убираем завершённый приём
        setAppointments(prev => prev.filter(a => a.pet.id !== petId));

        // очищаем данные формы
        setFormData(prev => {
            const newForm = { ...prev };
            delete newForm[petId];
            return newForm;
        });

    } catch (err) {
        console.error("Ошибка при сохранении:", err);
    }
};




    return (
        <div>
            <h2>Приёмы врача</h2>
            {appointments.length === 0 ? (
                <p>Нет приёмов</p>
            ) : (
                <ul>
                    {appointments.map((appt) => (
                        <li key={appt.id} style={{ marginBottom: '2rem' }}>
                            <strong>Дата:</strong> {appt.appointmentTime}<br />
                            <strong>Питомец:</strong> {appt.pet.name} ({appt.pet.species})<br />
                            <strong>Клиент:</strong> {appt.client.username}<br />

                            <div>
                                <label>Диагноз: </label>
                                <input
                                    type="text"
                                    value={formData[appt.pet.id]?.diagnosis || ''}
                                    onChange={(e) => handleChange(appt.pet.id, 'diagnosis', e.target.value)}
                                />
                            </div>
                            <div>
                                <label>Лечение: </label>
                                <input
                                    type="text"
                                    value={formData[appt.pet.id]?.treatment || ''}
                                    onChange={(e) => handleChange(appt.pet.id, 'treatment', e.target.value)}
                                />
                            </div>
                            <button onClick={() => handleSave(appt.pet.id)}>💾 Сохранить в медкарту</button>

                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default VetDashboardPage;
