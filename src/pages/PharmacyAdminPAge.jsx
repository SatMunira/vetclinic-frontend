import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

const PharmacyAdminPage = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', quantity: '', price: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  const fetchAll = async () => {
    try {
      const [itemsRes, ordersRes, stockRes] = await Promise.all([
        api.get('/pharmacy'),
        api.get('/pharmacy/orders'),
        api.get('/pharmacy/low-stock')
      ]);
      setItems(itemsRes.data);
      setOrders(ordersRes.data);
      setLowStock(stockRes.data);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.quantity || !form.price) {
      alert('Заполните обязательные поля: название, количество, цена');
      return;
    }
    try {
      if (editingId) {
        await api.put(`/pharmacy/${editingId}`, {
          ...form,
          quantity: Number(form.quantity),
          price: Number(form.price)
        });
      } else {
        await api.post('/pharmacy', {
          ...form,
          quantity: Number(form.quantity),
          price: Number(form.price)
        });
      }
      setForm({ name: '', quantity: '', price: '', description: '' });
      setEditingId(null);
      fetchAll();
    } catch (err) {
      console.error('Ошибка сохранения', err);
      alert('Ошибка при сохранении данных');
    }
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      description: item.description || ''
    });
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить этот товар?')) return;
    try {
      await api.delete(`/pharmacy/${id}`);
      fetchAll();
    } catch (err) {
      console.error('Ошибка при удалении', err);
      alert('Ошибка при удалении товара');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Админ: Аптека</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-10 space-y-4">
        <div>
          <label className="block mb-1 font-medium">Название *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Введите название"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Количество *</label>
            <input
              name="quantity"
              type="number"
              min="0"
              value={form.quantity}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Введите количество"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Цена (€) *</label>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Введите цену"
              required
            />
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium">Описание</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Введите описание (необязательно)"
            rows={3}
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold transition"
        >
          {editingId ? 'Обновить' : 'Добавить'}
        </button>
      </form>

      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4">Список лекарств</h3>
        {items.length === 0 ? (
          <p>Список пуст</p>
        ) : (
          <ul className="space-y-4">
            {items.map(item => (
              <li key={item.id} className="bg-white rounded shadow p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div>
                  <h4 className="text-lg font-semibold">{item.name}</h4>
                  <p className="text-gray-600">{item.description || 'Без описания'}</p>
                  <p className="mt-1 font-medium">
                    Количество: <span className="text-blue-700">{item.quantity}</span> шт
                    {' | '}
                    Цена: <span className="text-blue-700">{item.price} €</span>
                  </p>
                </div>
                <div className="mt-4 sm:mt-0 flex space-x-3">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white rounded px-4 py-1 transition"
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-600 hover:bg-red-700 text-white rounded px-4 py-1 transition"
                  >
                    Удалить
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mb-10">
        <h3 className="text-2xl font-semibold mb-4 text-red-600">Низкий остаток (меньше 5)</h3>
        {lowStock.length === 0 ? (
          <p>Низких остатков нет</p>
        ) : (
          <ul className="space-y-2 list-disc list-inside text-red-600">
            {lowStock.map(item => (
              <li key={item.id}>
                ⚠️ <strong>{item.name}</strong> – осталось <span className="font-semibold">{item.quantity}</span> шт
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="text-2xl font-semibold mb-4">Все заказы</h3>
        {orders.length === 0 ? (
          <p>Заказы отсутствуют</p>
        ) : (
          <ul className="space-y-3">
            {orders.map(order => (
              <li key={order.id} className="border rounded p-3 bg-white shadow-sm flex justify-between items-center">
                <div>
                  🧾 <strong>{order.item.name}</strong> — {order.quantity} шт — <span className="capitalize">{order.action.toLowerCase()}</span>
                </div>
                <div className="text-gray-600 italic">👤 {order.client.username}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default PharmacyAdminPage;
