import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { ProductList } from '../components/products/ProductList';
import { Pagination } from '../components/common/Pagination';
import { PRODUCTS_PER_PAGE } from '../utils/constants';

export const ProductsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, error, refetch } = useProducts(currentPage, PRODUCTS_PER_PAGE);

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-(--ctp-text) mb-2">Our Products</h1>
        <p className="text-(--ctp-subtext0)">
          Browse our collection of amazing products
        </p>
      </div>

      <ProductList
        products={data?.products || []}
        isLoading={isLoading}
        error={error}
        onRetry={() => refetch()}
      />

      {data?.pagination && data.pagination.total_pages > 1 && (
        <Pagination
          currentPage={data.pagination.page}
          totalPages={data.pagination.total_pages}
          onPageChange={setCurrentPage}
          hasNext={data.pagination.has_next}
          hasPrev={data.pagination.has_prev}
        />
      )}
    </div>
  );
};
