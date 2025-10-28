import { Link } from 'react-router-dom';
import type { Product } from '../../types/product.types';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../hooks/useCart';
import { Button } from '../common/Button';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return (
    <div className="bg-(--ctp-mantle) rounded-xl overflow-hidden border border-(--ctp-surface0) hover:border-(--ctp-mauve) transition-all duration-300 flex flex-col">
      {/* Product Image Placeholder */}
      <div className="w-full aspect-square bg-linear-to-br from-(--ctp-surface0) to-(--ctp-surface1) flex items-center justify-center">
        <svg
          className="w-20 h-20 text-(--ctp-overlay0)"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-(--ctp-text) hover:text-(--ctp-mauve) transition-colors mb-2 line-clamp-2">
            {product.product_name}
          </h3>
        </Link>

        <p className="text-2xl font-bold text-(--ctp-mauve) mt-auto mb-4">
          {formatCurrency(product.price)}
        </p>

        <Button onClick={handleAddToCart} variant="primary" size="md" className="w-full">
          Add to Cart
        </Button>
      </div>
    </div>
  );
};
