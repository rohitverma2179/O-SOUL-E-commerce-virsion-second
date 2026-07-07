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

  const addToCart = (product, size, color, quantityToAdd = 1) => {
    setCartItems((previous) => {
      // Find variant stock if variants exist, otherwise fall back to general stock
      let availableStock = product.stock;
      if (product.variants && product.variants.length > 0) {
        const variant = product.variants.find(
          (v) => 
            (!size || v.size?.toLowerCase() === size.toLowerCase()) &&
            (!color || v.color?.toLowerCase() === color.toLowerCase())
        );
        if (variant) {
          availableStock = variant.stock;
        }
      }

      // Check current quantity of this exact variant in the cart
      const existing = previous.find((item) => item.id === product.id && item.size === size && item.color === color);
      const currentQty = existing ? existing.quantity : 0;

      if (availableStock !== undefined && currentQty + quantityToAdd > availableStock) {
        alert(`Sorry, only ${availableStock} items are available in stock for this variant.`);
        return previous;
      }

      if (existing) {
        return previous.map((item) =>
          item.id === product.id && item.size === size && item.color === color
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      }
      return [...previous, { ...product, size, color, quantity: quantityToAdd }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId, size, color) => setCartItems((previous) => previous.filter((item) => !(item.id === itemId && item.size === size && item.color === color)));

  const updateQuantity = (itemId, size, color, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((previous) => {
      const target = previous.find((item) => item.id === itemId && item.size === size && item.color === color);
      if (!target) return previous;

      let availableStock = target.stock;
      if (target.variants && target.variants.length > 0) {
        const variant = target.variants.find(
          (v) => 
            (!size || v.size?.toLowerCase() === size.toLowerCase()) &&
            (!color || v.color?.toLowerCase() === color.toLowerCase())
        );
        if (variant) {
          availableStock = variant.stock;
        }
      }

      const allowed = availableStock === undefined ? newQuantity : Math.min(newQuantity, availableStock);
      return previous.map((item) =>
        item.id === itemId && item.size === size && item.color === color
          ? { ...item, quantity: allowed }
          : item
      );
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
