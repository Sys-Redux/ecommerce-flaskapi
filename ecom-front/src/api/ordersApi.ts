import axiosInstance from './axiosConfig';
import type { Order, CreateOrderData, OrderTotal, OrderStats } from '../types/order.types';
import type { Product } from '../types/product.types';

export const ordersApi = {
  createOrder: async (data: CreateOrderData): Promise<Order> => {
    const response = await axiosInstance.post<Order>('/orders', data);
    return response.data;
  },

  getOrders: async (): Promise<Order[]> => {
    const response = await axiosInstance.get<Order[]>('/orders');
    return response.data;
  },

  getOrderById: async (id: number): Promise<Order> => {
    const response = await axiosInstance.get<Order>(`/orders/${id}`);
    return response.data;
  },

  getOrdersByUser: async (userId: number): Promise<Order[]> => {
    const response = await axiosInstance.get<Order[]>(`/orders/user/${userId}`);
    return response.data;
  },

  getOrderProducts: async (orderId: number): Promise<Product[]> => {
    const response = await axiosInstance.get<Product[]>(`/orders/${orderId}/products`);
    return response.data;
  },

  getOrderTotal: async (orderId: number): Promise<OrderTotal> => {
    const response = await axiosInstance.get<OrderTotal>(`/orders/${orderId}/total`);
    return response.data;
  },

  getUserOrderStats: async (userId: number): Promise<OrderStats> => {
    const response = await axiosInstance.get<OrderStats>(`/users/${userId}/order_stats`);
    return response.data;
  },

  deleteOrder: async (id: number) => {
    const response = await axiosInstance.delete(`/orders/${id}`);
    return response.data;
  },
};
