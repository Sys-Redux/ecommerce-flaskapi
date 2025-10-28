import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useOrdersByUser } from '../hooks/useOrders';
import { Loading } from '../components/common/Loading';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { Button } from '../components/common/Button';
import { formatShortDate } from '../utils/formatters';

export const OrdersPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { data: orders, isLoading, error } = useOrdersByUser(user?.id);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage message="Failed to load orders" />;

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-(--ctp-text) mb-2">No orders yet</h2>
        <p className="text-(--ctp-subtext0) mb-6">Start shopping to see your orders here</p>
        <Button onClick={() => navigate('/products')} variant="primary">
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <h1 className="text-4xl font-bold text-(--ctp-text) mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-(--ctp-mantle) rounded-xl p-6 border border-(--ctp-surface0) hover:border-(--ctp-mauve) transition-all cursor-pointer"
            onClick={() => navigate(`/orders/${order.id}`)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-(--ctp-text)">
                  Order #{order.id}
                </h3>
                <p className="text-sm text-(--ctp-subtext0)">
                  {formatShortDate(order.order_date)}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-(--ctp-green)/20 text-(--ctp-green) text-sm font-medium">
                Completed
              </span>
            </div>

            {order.products && order.products.length > 0 && (
              <div className="text-sm text-(--ctp-subtext0)">
                {order.products.length} item{order.products.length !== 1 ? 's' : ''}
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <Button variant="ghost" size="sm">
                View Details →
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
