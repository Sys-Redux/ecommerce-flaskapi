import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { useAppDispatch } from '../store/hooks';
import { setCredentials } from '../features/auth/authSlice';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { validateEmail, validatePassword } from '../utils/validators';
import { ROUTES } from '../utils/constants';
import type { LoginResponse, LoginData } from '../types/user.types';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const loginMutation = useMutation<LoginResponse, Error, LoginData>({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      // Get user details
      const user = await authApi.getCurrentUser();
      dispatch(setCredentials({ user, token: data.access_token }));
      navigate(ROUTES.HOME);
    },
    onError: () => {
      setErrors({ email: 'Invalid email or password' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.message;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-ctp-mantle rounded-2xl p-8 shadow-xl border border-ctp-surface0">
          <h1 className="text-3xl font-bold text-ctp-text mb-2">Welcome Back</h1>
          <p className="text-ctp-subtext0 mb-8">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              error={errors.email}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              error={errors.password}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-ctp-subtext0">
              Don't have an account?{' '}
              <Link to={ROUTES.REGISTER} className="text-ctp-mauve hover:text-ctp-pink font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
