import { useEffect, useState } from "react";
import { API_URL, apiRequest } from "../services/apiClient";
import { Cart, Category, Product } from "../types";

export const useAgroApi = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productData, categoryData] = await Promise.all([
          apiRequest<Product[]>("/products"),
          apiRequest<Category[]>("/categories"),
        ]);
        setProducts(productData);
        setCategories(categoryData);

        try {
          const cartResponse = await fetch(`${API_URL}/cart/1`);
          if (!cartResponse.ok) throw new Error("Cart request failed");
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
    const res = await fetch(
      `${API_URL}/cart/1/items?cartId=1&productId=${productId}&quantity=1`,
      {
        method: "POST",
      },
    );
    setCart(await res.json());
  };

  const removeFromCart = async (productId: number) => {
    const res = await fetch(`${API_URL}/cart/1/items/${productId}`, {
      method: "DELETE",
    });
    setCart(await res.json());
  };

  return { products, categories, cart, loading, addToCart, removeFromCart };
};
