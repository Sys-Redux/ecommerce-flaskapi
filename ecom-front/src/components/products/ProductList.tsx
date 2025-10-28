import type { Product } from '../../types/product.types';
import { ProductCard } from './ProductCard';
import { Loading } from '../common/Loading';
import { ErrorMessage } from '../common/ErrorMessage';

interface ProductListProps {
  products: Product[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

export const ProductList = ({ products, isLoading, error, onRetry }: ProductListProps) => {
  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error.message || 'Failed to load products'} onRetry={onRetry} />;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-(--ctp-overlay0) text-lg">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
