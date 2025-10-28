import type { Product } from './product.types';

export interface Order {
  id: number;
  user_id: number;
  order_date: string;
  products?: Product[];
}

export interface CreateOrderData {
  user_id: number;
  product_ids: number[];
}

export interface OrderTotal {
  order_id: number;
  total_price: number;
  product_count: number;
}

export interface OrderStats {
  user_id: number;
  total_orders: number;
  total_spent: number;
}
