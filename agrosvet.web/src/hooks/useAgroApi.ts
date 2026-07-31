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

  const addToCart = async (productId: number) => {
    try {
      const res = await fetch(
        `${API_URL}/cart/1/items?cartId=1&productId=${productId}&quantity=1`,
        { method: "POST" },
      );
      if (!res.ok) throw new Error();
      setCart(await res.json());
      snackbar.success('Proizvod je dodat u korpu.');
    } catch {
      snackbar.error('Proizvod trenutno nije moguće dodati u korpu.');
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
    } catch {
      snackbar.error('Proizvod trenutno nije moguće ukloniti iz korpe.');
    }
  };

  return { products, categories, cart, loading, addToCart, removeFromCart };
};
