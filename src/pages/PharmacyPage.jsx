import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';

const PharmacyPage = () => {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: '', price: '', description: '' });
  const [loadingItems, setLoadingItems] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const loadItems = async () => {
    setLoadingItems(true);
    try {
      const res = await api.get('/pharmacy');
      setItems(res.data);
    } catch (err) {
      console.error('Ошибка загрузки товаров', err);
    } finally {
      setLoadingItems(false);
    }
  };

  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = user?.role === 'ROLE_ADMIN'
        ? await api.get('/pharmacy/orders')
        : await api.get('/pharmacy/my-orders');
      setOrders(res.data);
    } catch (err) {
      console.error('Ошибка загрузки заказов', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    loadItems();
    loadOrders();
  }, []);

  const handleAddItem = async () => {
    if (!newItem.name.trim() || !newItem.price || !newItem.quantity) {
      alert('Пожалуйста, заполните все обязательные поля (название, цена, количество)');
      return;
    }
    try {
      await api.post('/pharmacy', {
        ...newItem,
        price: Number(newItem.price),
        quantity: Number(newItem.quantity),
      });
      setNewItem({ name: '', quantity: '', price: '', description: '' });
      loadItems();
    } catch (err) {
      console.error('Ошибка при добавлении лекарства', err);
      alert('Ошибка при добавлении лекарства');
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот товар?')) return;
    try {
      await api.delete(`/pharmacy/${id}`);
      loadItems();
    } catch (err) {
      console.error('Ошибка при удалении лекарства', err);
      alert('Ошибка при удалении лекарства');
    }
  };

  const handleUpdateItem = async (id, item) => {
    if (!item.name.trim() || !item.price || !item.quantity) {
      alert('Пожалуйста, заполните все обязательные поля (название, цена, количество)');
      return;
    }
    try {
      await api.put(`/pharmacy/${id}`, {
        ...item,
        price: Number(item.price),
        quantity: Number(item.quantity),
      });
      loadItems();
    } catch (err) {
      console.error('Ошибка при обновлении лекарства', err);
      alert('Ошибка при обновлении лекарства');
    }
  };

  const handleOrder = async (itemId, quantity, action) => {
    if (quantity <= 0) {
      alert('Количество должно быть больше нуля');
      return;
    }
    try {
      await api.post(`/pharmacy/order`, null, {
        params: { itemId, quantity, action }
      });
      loadItems();
      loadOrders();
      alert(`Успешно выполнено действие: ${action}`);
    } catch (err) {
      console.error('Ошибка при заказе', err);
      alert('Ошибка при заказе');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">💊 Аптека</h2>

      {loadingItems ? (
        <p>Загрузка товаров...</p>
      ) : (
        <div className="space-y-4 mb-8">
          {items.length === 0 && <p>Товары не найдены</p>}
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map(item => (
              <li key={item.id} className="border rounded-xl p-4 shadow hover:shadow-lg transition bg-white flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                  <p className="text-gray-600 mb-1">{item.description || 'Без описания'}</p>
                  <p className="font-medium mb-1">Цена: {item.price} €</p>
                  <p className="font-medium mb-3">В наличии: {item.quantity}</p>
                </div>
                {user?.role === 'ROLE_ADMIN' ? (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition"
                    >
                      Удалить
                    </button>
                    <button
                      onClick={() => {
                        const name = prompt('Название', item.name);
                        const description = prompt('Описание', item.description);
                        const price = prompt('Цена', item.price);
                        const quantity = prompt('Количество', item.quantity);
                        if (name && price && quantity) {
                          handleUpdateItem(item.id, { name, description, price, quantity });
                        }
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded transition"
                    >
                      Редактировать
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleOrder(item.id, 1, 'BUY')}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded transition"
                    >
                      Купить
                    </button>
                    <button
                      onClick={() => handleOrder(item.id, 1, 'RESERVE')}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white py-1 px-3 rounded transition"
                    >
                      Резерв
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {user?.role === 'ROLE_ADMIN' && (
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-4">➕ Добавить лекарство</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md">
            <input
              type="text"
              placeholder="Название"
              value={newItem.name}
              onChange={e => setNewItem({ ...newItem, name: e.target.value })}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Описание"
              value={newItem.description}
              onChange={e => setNewItem({ ...newItem, description: e.target.value })}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Цена"
              value={newItem.price}
              onChange={e => setNewItem({ ...newItem, price: e.target.value })}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Количество"
              value={newItem.quantity}
              onChange={e => setNewItem({ ...newItem, quantity: e.target.value })}
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleAddItem}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded transition"
          >
            Добавить лекарство
          </button>
        </div>
      )}

      <h3 className="text-2xl font-semibold mb-4">{user?.role === 'ROLE_ADMIN' ? 'Все заказы' : 'Мои заказы'}</h3>
      {loadingOrders ? (
        <p>Загрузка заказов...</p>
      ) : (
        <ul className="space-y-3">
          {orders.length === 0 && <p>Заказы отсутствуют</p>}
          {orders.map(o => (
            <li key={o.id} className="border rounded p-3 shadow-sm bg-white">
              <span className="font-semibold">🧾 {o.item.name}</span> — {o.quantity} шт — <span className="capitalize">{o.action.toLowerCase()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PharmacyPage;
