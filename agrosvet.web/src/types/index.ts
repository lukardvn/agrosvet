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
  imageUrl: string;
  description?: string;
}

export type ProductInput = Omit<Product, 'id'>;

export interface ProductSaveInput extends Omit<ProductInput, 'imageUrl'> {
  imageUrl?: string;
  imageFile?: File;
}

export interface CategoryInput {
  name: string;
  parentId: number | null;
  imageFile?: File;
}

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
