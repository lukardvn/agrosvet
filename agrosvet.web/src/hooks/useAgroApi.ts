import { useEffect, useState } from "react";
import { API_URL, apiRequest } from "../services/apiClient";
import { Cart, Category, Product } from "../types";
import { useSnackbar } from "../components/SnackbarProvider";

export const useAgroApi = () => {
  const snackbar = useSnackbar();
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

  const addToCart = async (productId: number, quantity = 1) => {
    try {
      const res = await fetch(
        `${API_URL}/cart/1/items?productId=${productId}&quantity=${quantity}`,
        { method: "POST" },
      );
      if (!res.ok) throw new Error();
      setCart(await res.json());
      snackbar.success('Proizvod je dodat u korpu.');
      return true;
    } catch {
      snackbar.error('Proizvod trenutno nije moguće dodati u korpu.');
      return false;
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
      const res = await fetch(`${API_URL}/cart/1/items/${productId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setCart(await res.json());
      snackbar.info('Proizvod je uklonjen iz korpe.', { title: 'Korpa je ažurirana' });
      return true;
    } catch {
      snackbar.error('Proizvod trenutno nije moguće ukloniti iz korpe.');
      return false;
    }
  };

  const updateCartQuantity = async (productId: number, quantity: number) => {
    try {
      const updatedCart = await apiRequest<Cart>(`/cart/1/items/${productId}?quantity=${quantity}`, {
        method: "PUT",
      });
      setCart(updatedCart);
    } catch (error) {
      snackbar.error('Količina trenutno ne može da se izmeni.');
      throw error;
    }
  };

  return { products, categories, cart, loading, addToCart, removeFromCart, updateCartQuantity };
};
