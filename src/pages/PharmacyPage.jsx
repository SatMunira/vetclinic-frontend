import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';

const PharmacyPage = () => {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: 0, price: 0, description: '' });

  const loadItems = async () => {
    const res = await api.get('/pharmacy');
    setItems(res.data);
  };

  const loadOrders = async () => {
    const res = user?.role === 'ROLE_ADMIN'
      ? await api.get('/pharmacy/orders')
      : await api.get('/pharmacy/my-orders');
    setOrders(res.data);
  };

  useEffect(() => {
    loadItems();
    loadOrders();
  }, []);

  const handleAddItem = async () => {
    await api.post('/pharmacy', newItem);
    setNewItem({ name: '', quantity: 0, price: 0, description: '' });
    loadItems();
  };

  const handleDeleteItem = async (id) => {
    await api.delete(`/pharmacy/${id}`);
    loadItems();
  };

  const handleUpdateItem = async (id, item) => {
    await api.put(`/pharmacy/${id}`, item);
    loadItems();
  };

  const handleOrder = async (itemId, quantity, action) => {
    await api.post(`/pharmacy/order`, null, {
      params: { itemId, quantity, action }
    });
    loadItems();
    loadOrders();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Аптека</h2>

      <h3>Лекарства</h3>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            💊 {item.name} — 💬 {item.description} — 💶 {item.price} € — 📦 {item.quantity}
            {user?.role === 'ROLE_ADMIN' ? (
              <div>
                <button onClick={() => handleDeleteItem(item.id)}>Удалить</button>
                <button onClick={() => {
                  const name = prompt('Название', item.name);
                  const description = prompt('Описание', item.description);
                  const price = prompt('Цена', item.price);
                  const quantity = prompt('Количество', item.quantity);
                  handleUpdateItem(item.id, { name, description, price, quantity });
                }}>Редактировать</button>
              </div>
            ) : (
              <div>
                <button onClick={() => handleOrder(item.id, 1, 'BUY')}>Купить</button>
                <button onClick={() => handleOrder(item.id, 1, 'RESERVE')}>Резерв</button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {user?.role === 'ROLE_ADMIN' && (
        <div>
          <h3>➕ Добавить лекарство</h3>
          <input
            placeholder="Название"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <input
            placeholder="Описание"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          />
          <input
            type="number"
            placeholder="Цена"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
          />
          <input
            type="number"
            placeholder="Количество"
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
          />
          <button onClick={handleAddItem}>Добавить</button>
        </div>
      )}

      <h3>{user?.role === 'ROLE_ADMIN' ? 'Все заказы' : 'Мои заказы'}</h3>
      <ul>
        {orders.map(o => (
          <li key={o.id}>
            🧾 {o.item.name} – {o.quantity} шт – {o.action}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PharmacyPage;
