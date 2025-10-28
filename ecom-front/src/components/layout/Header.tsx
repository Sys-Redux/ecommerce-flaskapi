import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useAppDispatch } from '../../store/hooks';
import { logout } from '../../features/auth/authSlice';
import { APP_NAME, ROUTES } from '../../utils/constants';

export const Header = () => {
  const { itemCount } = useCart();
  const { isAuthenticated, user } = useAuth();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-(--ctp-mantle) border-b border-(--ctp-surface0) sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-(--ctp-mauve) to-(--ctp-pink) flex items-center justify-center">
              <span className="text-(--ctp-crust) font-bold text-xl">C</span>
            </div>
            <span className="text-xl font-bold text-(--ctp-text)">{APP_NAME}</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to={ROUTES.HOME}
              className="text-(--ctp-text) hover:text-(--ctp-mauve) transition-colors"
            >
              Home
            </Link>
            <Link
              to={ROUTES.PRODUCTS}
              className="text-(--ctp-text) hover:text-(--ctp-mauve) transition-colors"
            >
              Products
            </Link>
            {isAuthenticated && (
              <Link
                to={ROUTES.ORDERS}
                className="text-(--ctp-text) hover:text-(--ctp-mauve) transition-colors"
              >
                Orders
              </Link>
            )}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link
              to={ROUTES.CART}
              className="relative p-2 hover:bg-(--ctp-surface0) rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6 text-(--ctp-text)"
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
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-(--ctp-red) text-(--ctp-crust) text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User menu */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to={ROUTES.PROFILE}
                  className="text-(--ctp-text) hover:text-(--ctp-mauve) transition-colors"
                >
                  {user?.name || 'Profile'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-(--ctp-surface0) hover:bg-(--ctp-surface1) text-(--ctp-text) rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to={ROUTES.LOGIN}
                className="px-4 py-2 bg-(--ctp-mauve) hover:bg-(--ctp-pink) text-(--ctp-crust) rounded-lg font-medium transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
