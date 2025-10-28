import { useAppSelector } from '../store/hooks';

export const useAuth = () => {
  const { user, token, isAuthenticated } = useAppSelector((state) => state.auth);

  return {
    user,
    token,
    isAuthenticated,
  };
};
