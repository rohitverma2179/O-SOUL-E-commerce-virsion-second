import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from '../lib/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const loadedUserId = useRef(null);
  const saveTimer = useRef(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      loadedUserId.current = null;
      setCartItems([]);
      return;
    }

    setCartLoading(true);
    loadedUserId.current = null;
    fetch(`${API_BASE_URL}/users/cart`, { credentials: 'include' })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.message);
        setCartItems(payload.data || []);
        loadedUserId.current = user.id;
      })
      .catch((error) => console.error('Failed to load cart:', error))
      .finally(() => setCartLoading(false));
  }, [authLoading, user?.id]);

  useEffect(() => {
    if (!user || loadedUserId.current !== user.id) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      fetch(`${API_BASE_URL}/users/cart`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ items: cartItems })
      }).catch((error) => console.error('Failed to save cart:', error));
    }, 300);
    return () => clearTimeout(saveTimer.current);
  }, [cartItems, user?.id]);

  const addToCart = (product, size, color) => {
    setCartItems((previous) => {
      const productQuantity = previous.filter((item) => item.id === product.id).reduce((total, item) => total + item.quantity, 0);
      if (product.stock !== undefined && productQuantity >= product.stock) return previous;
      const existing = previous.find((item) => item.id === product.id && item.size === size && item.color === color);
      if (existing) return previous.map((item) => item.id === product.id && item.size === size && item.color === color ? { ...item, quantity: item.quantity + 1 } : item);
      return [...previous, { ...product, size, color, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId, size, color) => setCartItems((previous) => previous.filter((item) => !(item.id === itemId && item.size === size && item.color === color)));

  const updateQuantity = (itemId, size, color, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((previous) => {
      const target = previous.find((item) => item.id === itemId && item.size === size && item.color === color);
      const otherQuantity = previous.filter((item) => item.id === itemId && !(item.size === size && item.color === color)).reduce((total, item) => total + item.quantity, 0);
      const allowed = target?.stock === undefined ? newQuantity : Math.min(newQuantity, Math.max(1, target.stock - otherQuantity));
      return previous.map((item) => item.id === itemId && item.size === size && item.color === color ? { ...item, quantity: allowed } : item);
    });
  };

  const cartTotal = cartItems.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, cartLoading, isCartOpen, setIsCartOpen, addToCart, removeFromCart, updateQuantity, cartTotal, cartCount, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
