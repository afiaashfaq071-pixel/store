import { useContext } from 'react';
import { OrderContext } from '../context/OrderContext.jsx';

export default function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used inside OrderProvider');
  return ctx;
}
