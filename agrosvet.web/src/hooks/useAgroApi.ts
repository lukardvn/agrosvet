import { useState, useEffect } from 'react';
import { Product, Category, Cart } from '../types';

const API_URL = 'http://localhost:5000';

export const useAgroApi = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, cRes, cartRes] = await Promise.all([
          fetch(`${API_URL}/products`),
          fetch(`${API_URL}/categories`),
          fetch(`${API_URL}/cart/1`)
        ]);
        setProducts(await pRes.json());
        setCategories(await cRes.json());
        setCart(await cartRes.json());
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addToCart = async (productId: number) => {
    const res = await fetch(`${API_URL}/cart/1/items?cartId=1&productId=${productId}&quantity=1`, {
      method: 'POST'
    });
    setCart(await res.json());
  };

  const removeFromCart = async (productId: number) => {
    const res = await fetch(`${API_URL}/cart/1/items/${productId}`, {
      method: 'DELETE'
    });
    setCart(await res.json());
  };

  return { products, categories, cart, loading, addToCart, removeFromCart };
};
