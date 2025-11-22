import React, { createContext, useState, useContext } from 'react';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);

  const createOrder = (orderData) => {
    const newOrder = {
      id: `#GH${String(Math.floor(Math.random() * 999999)).padStart(6, '0')}`,
      date: new Date().toLocaleDateString('pt-BR'),
      dateTime: new Date().toISOString(),
      status: 'Pedido Confirmado',
      estimatedDays: Math.floor(Math.random() * 3) + 2, // 2-4 dias
      ...orderData,
      timeline: [
        {
          id: 1,
          title: 'Pedido Confirmado',
          date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          status: 'completed',
          icon: 'check-circle',
          color: '#2196F3',
        },
        {
          id: 2,
          title: 'Preparando Envio',
          date: '',
          time: '',
          status: 'pending',
          icon: 'box',
          color: '#9E9E9E',
        },
        {
          id: 3,
          title: 'Produto Enviado',
          date: '',
          time: '',
          status: 'pending',
          icon: 'truck',
          color: '#9E9E9E',
        },
        {
          id: 4,
          title: 'A Caminho',
          date: '',
          time: '',
          status: 'pending',
          icon: 'location',
          color: '#9E9E9E',
        },
        {
          id: 5,
          title: 'Entregue',
          subtitle: '',
          status: 'pending',
          icon: 'check',
          color: '#9E9E9E',
        },
      ],
    };

    setOrders([newOrder, ...orders]);
    return newOrder;
  };

  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId);
  };

  const getAllOrders = () => {
    return orders;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId
        ? { ...order, status: newStatus }
        : order
    ));
  };

  const value = {
    orders,
    createOrder,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
