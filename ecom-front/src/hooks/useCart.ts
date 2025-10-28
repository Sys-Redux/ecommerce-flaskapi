import { useAppSelector, useAppDispatch } from '../store/hooks';
import { addToCart, removeFromCart, updateQuantity, clearCart } from '../features/cart/cartSlice';
import type { Product } from '../types/product.types';

export const useCart = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const total = useAppSelector((state) => state.cart.total);
  const itemCount = useAppSelector((state) =>
    state.cart.items.reduce((count, item) => count + item.quantity, 0)
  );

  const add = (product: Product, quantity = 1) => {
    dispatch(addToCart({ product, quantity }));
  };

  const remove = (productId: number) => {
    dispatch(removeFromCart(productId));
  };

  const update = (productId: number, quantity: number) => {
    dispatch(updateQuantity({ productId, quantity }));
  };

  const clear = () => {
    dispatch(clearCart());
  };

  return {
    items,
    total,
    itemCount,
    addToCart: add,
    removeFromCart: remove,
    updateQuantity: update,
    clearCart: clear,
  };
};
