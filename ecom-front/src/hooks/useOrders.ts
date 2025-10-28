import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../api/ordersApi';

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: ordersApi.getOrders,
  });
};

export const useOrdersByUser = (userId: number | undefined) => {
  return useQuery({
    queryKey: ['orders', 'user', userId],
    queryFn: () => ordersApi.getOrdersByUser(userId!),
    enabled: !!userId,
  });
};

export const useOrder = (orderId: number | undefined) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => ordersApi.getOrderById(orderId!),
    enabled: !!orderId,
  });
};

export const useOrderProducts = (orderId: number | undefined) => {
  return useQuery({
    queryKey: ['order', orderId, 'products'],
    queryFn: () => ordersApi.getOrderProducts(orderId!),
    enabled: !!orderId,
  });
};

export const useOrderTotal = (orderId: number | undefined) => {
  return useQuery({
    queryKey: ['order', orderId, 'total'],
    queryFn: () => ordersApi.getOrderTotal(orderId!),
    enabled: !!orderId,
  });
};

export const useUserOrderStats = (userId: number | undefined) => {
  return useQuery({
    queryKey: ['user', userId, 'orderStats'],
    queryFn: () => ordersApi.getUserOrderStats(userId!),
    enabled: !!userId,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ordersApi.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ordersApi.deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
