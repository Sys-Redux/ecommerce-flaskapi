export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Catppuccin Store';

export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
} as const;

export const AUTH_TOKEN_KEY = 'auth_token';
export const CART_STORAGE_KEY = 'shopping_cart';

export const PRODUCTS_PER_PAGE = 12;
