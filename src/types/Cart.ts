import type { Product } from "./Product";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  user: string;
  items: CartItem[];
  totalAmount: number;
}
