export interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  categoryId: number;
  status: 'active' | 'inactive';
}

export interface Category {
  id: number;
  name: string;
  parentId: number | null;
  description?: string;
}

export type ProductInput = Omit<Product, 'id'>;

export interface ProductSaveInput extends Omit<ProductInput, 'imageUrl'> {
  imageUrl?: string;
  imageFile?: File;
}

export type CategoryInput = Omit<Category, 'id'>;

export interface CartItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  totalPrice: number;
}
