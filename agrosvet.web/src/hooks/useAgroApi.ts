import { useState, useEffect } from 'react';
import { Product, Category, Cart } from '../types';
import { adminApi } from '../services/adminApi';

const API_URL = 'http://localhost:5000';

export const useAgroApi = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productData, categoryData] = await Promise.all([
          adminApi.getProducts(),
          adminApi.getCategories(),
        ]);
        setProducts(productData.filter(product => product.status === 'active'));
        setCategories(categoryData);

        try {
          const cartResponse = await fetch(`${API_URL}/cart/1`);
          if (!cartResponse.ok) throw new Error('Cart request failed');
          setCart(await cartResponse.json());
        } catch {
          setCart({ id: 1, items: [], totalPrice: 0 });
        }
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
