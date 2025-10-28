import axiosInstance from './axiosConfig';
import type { Product, ProductsResponse, CreateProductData, UpdateProductData } from '../types/product.types';

export const productsApi = {
  getProducts: async (page = 1, perPage = 12): Promise<ProductsResponse> => {
    const response = await axiosInstance.get<ProductsResponse>('/products', {
      params: { page, per_page: perPage },
    });
    return response.data;
  },

  getProductById: async (id: number): Promise<Product> => {
    const response = await axiosInstance.get<Product>(`/products/${id}`);
    return response.data;
  },

  createProduct: async (data: CreateProductData): Promise<Product> => {
    const response = await axiosInstance.post<Product>('/products', data);
    return response.data;
  },

  updateProduct: async (id: number, data: UpdateProductData): Promise<Product> => {
    const response = await axiosInstance.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: number) => {
    const response = await axiosInstance.delete(`/products/${id}`);
    return response.data;
  },
};
