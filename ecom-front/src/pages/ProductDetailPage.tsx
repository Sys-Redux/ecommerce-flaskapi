import { useParams, useNavigate } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { Loading } from '../components/common/Loading';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { Button } from '../components/common/Button';
import { formatCurrency } from '../utils/formatters';
import { useState } from 'react';

export const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useProduct(Number(id));
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      navigate('/cart');
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage message="Failed to load product" />;
  if (!product) return <ErrorMessage message="Product not found" />;

  return (
    <div className="animate-fadeIn max-w-6xl mx-auto">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        ← Back
      </Button>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="aspect-square rounded-2xl bg-linear-to-br from-(--ctp-surface0) to-(--ctp-surface1) flex items-center justify-center border border-(--ctp-surface2)">
          <svg
            className="w-32 h-32 text-(--ctp-overlay0)"
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

        {/* Product Details */}
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold text-(--ctp-text) mb-4">
            {product.product_name}
          </h1>

          <p className="text-4xl font-bold text-(--ctp-mauve) mb-8">
            {formatCurrency(product.price)}
          </p>

          <div className="bg-(--ctp-mantle) rounded-xl p-6 mb-8 border border-(--ctp-surface0)">
            <h3 className="text-lg font-semibold text-(--ctp-text) mb-4">Product Details</h3>
            <div className="space-y-2 text-(--ctp-subtext0)">
              <p>High-quality product from our collection</p>
              <p>Fast shipping and excellent customer service</p>
              <p>30-day return policy</p>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-(--ctp-subtext1) mb-2">
              Quantity
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-lg bg-(--ctp-surface0) hover:bg-(--ctp-surface1) text-(--ctp-text) flex items-center justify-center transition-colors"
              >
                −
              </button>
              <span className="w-16 text-center text-xl font-semibold text-(--ctp-text)">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-lg bg-(--ctp-surface0) hover:bg-(--ctp-surface1) text-(--ctp-text) flex items-center justify-center transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            variant="primary"
            size="lg"
            className="w-full"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};
