export interface Product {
  id: number;
  product_name: string;
  price: number;
}

export interface PaginationInfo {
  page: number;
  per_page: number;
  total_pages: number;
  total_items: number;
  has_next: boolean;
  has_prev: boolean;
  next_page: number | null;
  prev_page: number | null;
}

export interface ProductsResponse {
  products: Product[];
  pagination: PaginationInfo;
}

export interface CreateProductData {
  product_name: string;
  price: number;
}

export interface UpdateProductData {
  product_name?: string;
  price?: number;
}
