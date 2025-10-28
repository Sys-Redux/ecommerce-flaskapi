import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import { useAppDispatch } from '../store/hooks';
import { setCredentials } from '../features/auth/authSlice';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { validateEmail, validatePassword, validateRequired } from '../utils/validators';
import { ROUTES } from '../utils/constants';
import type { RegisterData } from '../types/user.types';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const registerMutation = useMutation<void, unknown, RegisterData>({
    mutationFn: authApi.register,
    onSuccess: async () => {
      // Auto-login after registration
      const loginData = await authApi.login({
        email: formData.email,
        password: formData.password,
      });
      const user = await authApi.getCurrentUser();
      dispatch(setCredentials({ user, token: loginData.access_token }));
      navigate(ROUTES.HOME);
    },
    onError: (error: unknown) => {
      const apiError = error as { response?: { data?: { message?: string } } };
      setErrors({ email: apiError.response?.data?.message || 'Registration failed' });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!validateRequired(formData.name)) {
      newErrors.name = 'Name is required';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.message!;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!validateRequired(formData.address)) {
      newErrors.address = 'Address is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    registerMutation.mutate({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      address: formData.address,
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="bg-(--ctp-mantle) rounded-2xl p-8 shadow-xl border border-(--ctp-surface0)">
          <h1 className="text-3xl font-bold text-(--ctp-text) mb-2">Create Account</h1>
          <p className="text-(--ctp-subtext0) mb-8">Join us today</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
            />

            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />

            <Input
              label="Address"
              name="address"
              type="text"
              placeholder="123 Main St, City, State"
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-(--ctp-subtext0)">
              Already have an account?{' '}
              <Link to={ROUTES.LOGIN} className="text-(--ctp-mauve) hover:text-(--ctp-pink) font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
