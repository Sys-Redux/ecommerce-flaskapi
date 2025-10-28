import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { ProductList } from '../components/products/ProductList';
import { Button } from '../components/common/Button';
import { APP_NAME } from '../utils/constants';

export const HomePage = () => {
  const { data, isLoading, error, refetch } = useProducts(1, 8);

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <div className="text-center py-16 mb-12">
        <h1 className="text-5xl md:text-6xl font-bold text-(--ctp-text) mb-4">
          Welcome to <span className="text-transparent bg-clip-text bg-linear-to-r from-(--ctp-mauve) to-(--ctp-pink)">{APP_NAME}</span>
        </h1>
        <p className="text-xl text-(--ctp-subtext0) mb-8 max-w-2xl mx-auto">
          Discover amazing products with a beautiful Catppuccin-themed shopping experience
        </p>
        <Link to="/products">
          <Button variant="primary" size="lg">
            Shop Now
          </Button>
        </Link>
      </div>

      {/* Featured Products */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-(--ctp-text)">Featured Products</h2>
          <Link to="/products">
            <Button variant="ghost" size="sm">
              View All →
            </Button>
          </Link>
        </div>

        <ProductList
          products={data?.products || []}
          isLoading={isLoading}
          error={error}
          onRetry={() => refetch()}
        />
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 py-12">
        <div className="text-center p-6 bg-(--ctp-mantle) rounded-xl border border-(--ctp-surface0)">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-(--ctp-mauve)/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-(--ctp-mauve)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-(--ctp-text) mb-2">Quality Products</h3>
          <p className="text-(--ctp-subtext0)">Carefully curated selection of premium items</p>
        </div>

        <div className="text-center p-6 bg-(--ctp-mantle) rounded-xl border border-(--ctp-surface0)">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-(--ctp-green)/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-(--ctp-green)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-(--ctp-text) mb-2">Best Prices</h3>
          <p className="text-(--ctp-subtext0)">Competitive pricing on all products</p>
        </div>

        <div className="text-center p-6 bg-(--ctp-mantle) rounded-xl border border-(--ctp-surface0)">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-(--ctp-blue)/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-(--ctp-blue)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-(--ctp-text) mb-2">Fast Shipping</h3>
          <p className="text-(--ctp-subtext0)">Quick delivery to your doorstep</p>
        </div>
      </div>
    </div>
  );
};
