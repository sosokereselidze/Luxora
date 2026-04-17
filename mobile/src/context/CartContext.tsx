import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Product {
  _id: string;
  name: string;
  price: number;
  image?: string;
  brand?: string;
  category?: string;
}

interface CartItem extends Product {
  volume: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, volume: string, price: number) => void;
  updateQuantity: (productId: string, volume: string, quantity: number) => void;
  removeFromCart: (productId: string, volume: string) => void;
  clearCart: () => Promise<void>;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const savedCart = await AsyncStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error('Failed to load cart', e);
    }
  };

  const saveCart = async (newCart: CartItem[]) => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(newCart));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  };

  const addToCart = (product: Product, volume: string, price: number) => {
    const existingItemIndex = cart.findIndex(item => item._id === product._id && item.volume === volume);
    let newCart;
    if (existingItemIndex > -1) {
      newCart = [...cart];
      newCart[existingItemIndex] = { 
        ...newCart[existingItemIndex], 
        quantity: newCart[existingItemIndex].quantity + 1 
      };
    } else {
      newCart = [...cart, { ...product, volume, price, quantity: 1 }];
    }
    setCart(newCart);
    saveCart(newCart);
  };

  const updateQuantity = (productId: string, volume: string, quantity: number) => {
    const newCart = cart.map(item => 
      item._id === productId && item.volume === volume 
        ? { ...item, quantity: Math.max(1, quantity) }
        : item
    );
    setCart(newCart);
    saveCart(newCart);
  };

  const removeFromCart = (productId: string, volume: string) => {
    const newCart = cart.filter(item => !(item._id === productId && item.volume === volume));
    setCart(newCart);
    saveCart(newCart);
  };

  const clearCart = async () => {
    setCart([]);
    await AsyncStorage.removeItem('cart');
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
