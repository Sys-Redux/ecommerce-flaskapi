import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useCreateOrder } from '../hooks/useOrders';
import { Button } from '../components/common/Button';
import { formatCurrency } from '../utils/formatters';

export const CheckoutPage = () => {
  const { items, total, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const createOrderMutation = useCreateOrder();

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleCheckout = async () => {
    if (!user) return;

    try {
      await createOrderMutation.mutateAsync({
        user_id: user.id,
        product_ids: items.map((item) => item.id),
      });

      clearCart();
      navigate('/orders');
    } catch (error) {
      console.error('Checkout failed:', error);
    }
  };

  return (
    <div className="animate-fadeIn max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-(--ctp-text) mb-8">Checkout</h1>

      <div className="space-y-6">
        {/* User Info */}
        <div className="bg-(--ctp-mantle) rounded-xl p-6 border border-(--ctp-surface0)">
          <h2 className="text-xl font-semibold text-(--ctp-text) mb-4">Shipping Information</h2>
          <div className="space-y-2 text-(--ctp-subtext0)">
            <p><span className="font-medium text-(--ctp-text)">Name:</span> {user?.name}</p>
            <p><span className="font-medium text-(--ctp-text)">Email:</span> {user?.email}</p>
            <p><span className="font-medium text-(--ctp-text)">Address:</span> {user?.address}</p>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-(--ctp-mantle) rounded-xl p-6 border border-(--ctp-surface0)">
          <h2 className="text-xl font-semibold text-(--ctp-text) mb-4">Order Items</h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b border-(--ctp-surface0) last:border-0">
                <div>
                  <p className="font-medium text-(--ctp-text)">{item.product_name}</p>
                  <p className="text-sm text-(--ctp-subtext0)">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-(--ctp-mauve)">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Total */}
        <div className="bg-(--ctp-mantle) rounded-xl p-6 border border-(--ctp-surface0)">
          <div className="flex justify-between items-center text-2xl font-bold">
            <span className="text-(--ctp-text)">Total</span>
            <span className="text-(--ctp-mauve)">{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={() => navigate('/cart')}
            variant="secondary"
            size="lg"
            className="flex-1"
          >
            Back to Cart
          </Button>
          <Button
            onClick={handleCheckout}
            variant="primary"
            size="lg"
            className="flex-1"
            disabled={createOrderMutation.isPending}
          >
            {createOrderMutation.isPending ? 'Processing...' : 'Place Order'}
          </Button>
        </div>
      </div>
    </div>
  );
};
