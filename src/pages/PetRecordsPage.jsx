import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PetRecordsPage = () => {
  const { id: petId } = useParams(); // или просто const { id } = useParams();
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:8080/api/records/pet/${petId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRecords(res.data);
    };
    fetchRecords();
  }, [petId]);

  return (
    <div>
      <h2>Медкарта питомца</h2>
      {records.map((rec) => (
        <div key={rec.id}>
          <strong>Дата:</strong> {rec.date}<br />
          <strong>Диагноз:</strong> {rec.diagnosis}<br />
          <strong>Лечение:</strong> {rec.treatment}
          <hr />
        </div>
      ))}
      
    </div>
  );
};

export default PetRecordsPage;
