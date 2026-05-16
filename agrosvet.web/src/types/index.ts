export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
}

export interface Category {
  id: number;
  name: string;
  description: string;
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
