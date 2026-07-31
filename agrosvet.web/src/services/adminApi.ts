import { Category, CategoryInput, Product, ProductSaveInput } from '../types';
import { ApiError, apiRequest } from './apiClient';

const productFormData = (input: ProductSaveInput) => {
  const formData = new FormData();
  formData.append('name', input.name);
  formData.append('description', input.description);
  formData.append('price', input.price.toString());
  formData.append('categoryId', input.categoryId.toString());
  formData.append('status', input.status);
  if (input.imageFile) formData.append('image', input.imageFile);
  return formData;
};

export const adminApi = {
  getProducts: () => apiRequest<Product[]>('/admin/products'),

  async getProduct(id: number): Promise<Product | null> {
    try {
      return await apiRequest<Product>(`/admin/products/${id}`);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null;
      throw error;
    }
  },

  createProduct: (input: ProductSaveInput) =>
    apiRequest<Product>('/admin/products', {
      method: 'POST',
      body: productFormData(input),
    }),

  updateProduct: (id: number, input: ProductSaveInput) =>
    apiRequest<Product>(`/admin/products/${id}`, {
      method: 'PUT',
      body: productFormData(input),
    }),

  getCategories: () => apiRequest<Category[]>('/categories'),

  async getCategory(id: number): Promise<Category | null> {
    try {
      return await apiRequest<Category>(`/categories/${id}`);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) return null;
      throw error;
    }
  },

  createCategory: (input: CategoryInput) =>
    apiRequest<Category>('/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }),

  updateCategory: (id: number, input: CategoryInput) =>
    apiRequest<Category>(`/admin/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    }),
};
