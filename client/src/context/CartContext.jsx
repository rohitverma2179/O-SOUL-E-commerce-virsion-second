import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('osoul-cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('osoul-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, size, color) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id && item.size === size && item.color === color);
      if (existing) {
        return prev.map(item => 
          item.id === product.id && item.size === size && item.color === color 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, size, color, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId, size, color) => {
    setCartItems(prev => prev.filter(item => !(item.id === itemId && item.size === size && item.color === color)));
  };

  const updateQuantity = (itemId, size, color, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item => 
      item.id === itemId && item.size === size && item.color === color 
        ? { ...item, quantity: newQuantity } 
        : item
    ));
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      isCartOpen, 
      setIsCartOpen, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      cartTotal, 
      cartCount 
    }}>
      {children}
    </CartContext.Provider>
  );
};
