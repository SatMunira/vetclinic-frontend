import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

const PharmacyAdminPage = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', quantity: '', price: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  const fetchAll = async () => {
    const [itemsRes, ordersRes, stockRes] = await Promise.all([
      api.get('/pharmacy'),
      api.get('/pharmacy/orders'),
      api.get('/pharmacy/low-stock')
    ]);
    setItems(itemsRes.data);
    setOrders(ordersRes.data);
    setLowStock(stockRes.data);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/pharmacy/${editingId}`, form);
      } else {
        await api.post('/pharmacy', form);
      }
      setForm({ name: '', quantity: '', price: '', description: '' });
      setEditingId(null);
      fetchAll();
    } catch (err) {
      console.error('Ошибка сохранения', err);
    }
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    await api.delete(`/pharmacy/${id}`);
    fetchAll();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Админ: Аптека</h2>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Название" value={form.name} onChange={handleChange} required />
        <input name="quantity" type="number" placeholder="Количество" value={form.quantity} onChange={handleChange} required />
        <input name="price" type="number" step="0.01" placeholder="Цена" value={form.price} onChange={handleChange} required />
        <input name="description" placeholder="Описание" value={form.description} onChange={handleChange} />
        <button type="submit">{editingId ? 'Обновить' : 'Добавить'}</button>
      </form>

      <h3>Список лекарств</h3>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            <strong>{item.name}</strong> – 💊 {item.quantity} шт – 💰 {item.price}€<br />
            <em>{item.description}</em><br />
            <button onClick={() => handleEdit(item)}>Редактировать</button>
            <button onClick={() => handleDelete(item.id)}>Удалить</button>
          </li>
        ))}
      </ul>

      <h3>Низкий остаток (меньше 5)</h3>
      <ul>
        {lowStock.map(item => (
          <li key={item.id}>
            ⚠️ {item.name} – осталось {item.quantity} шт
          </li>
        ))}
      </ul>

      <h3>Все заказы</h3>
      <ul>
        {orders.map(order => (
          <li key={order.id}>
            🧾 {order.item.name} – {order.quantity} шт – {order.action} – 👤 {order.client.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PharmacyAdminPage;
