import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { Button } from '../components/common/Button';
import { formatCurrency } from '../utils/formatters';

export const CartPage = () => {
  const { items, total, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <svg
          className="w-24 h-24 text-(--ctp-overlay0) mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h2 className="text-2xl font-bold text-(--ctp-text) mb-2">Your cart is empty</h2>
        <p className="text-(--ctp-subtext0) mb-6">Add some products to get started</p>
        <Button onClick={() => navigate('/products')} variant="primary">
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <h1 className="text-4xl font-bold text-(--ctp-text) mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-(--ctp-mantle) rounded-xl p-6 border border-(--ctp-surface0) flex gap-4"
            >
              <div className="w-24 h-24 rounded-lg bg-linear-to-br from-(--ctp-surface0) to-(--ctp-surface1) flex items-center justify-center shrink-0">
                <svg
                  className="w-12 h-12 text-(--ctp-overlay0)"
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

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-(--ctp-text) mb-2">
                  {item.product_name}
                </h3>
                <p className="text-xl font-bold text-(--ctp-mauve) mb-4">
                  {formatCurrency(item.price)}
                </p>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-lg bg-(--ctp-surface0) hover:bg-(--ctp-surface1) text-(--ctp-text) flex items-center justify-center transition-colors"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-semibold text-(--ctp-text)">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-(--ctp-surface0) hover:bg-(--ctp-surface1) text-(--ctp-text) flex items-center justify-center transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-(--ctp-red) hover:text-(--ctp-maroon) transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
                <p className="text-lg font-bold text-(--ctp-text)">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-(--ctp-mantle) rounded-xl p-6 border border-(--ctp-surface0) sticky top-24">
            <h2 className="text-2xl font-bold text-(--ctp-text) mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-(--ctp-subtext0)">
                <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between text-(--ctp-subtext0)">
                <span>Shipping</span>
                <span className="text-(--ctp-green)">Free</span>
              </div>
              <div className="border-t border-(--ctp-surface0) pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-(--ctp-text)">Total</span>
                  <span className="text-(--ctp-mauve)">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => navigate('/checkout')}
              variant="primary"
              size="lg"
              className="w-full mb-3"
            >
              Proceed to Checkout
            </Button>

            <Button
              onClick={() => navigate('/products')}
              variant="ghost"
              size="md"
              className="w-full"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
