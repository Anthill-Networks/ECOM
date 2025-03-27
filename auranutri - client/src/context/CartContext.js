import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../axios';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = async (forceRefresh = false) => {
    try {
      const response = await axiosInstance.post('/carts/itemcount');
      setCartCount(response.data.item_count);
    } catch (error) {
      console.error('Error fetching cart count:', error);
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
} 