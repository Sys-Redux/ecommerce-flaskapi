import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAppDispatch } from '../store/hooks';
import { updateUserProfile, logout } from '../features/auth/authSlice';
import { authApi } from '../api/authApi';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { validateEmail, validateRequired } from '../utils/validators';

export const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: user?.address || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthenticated || !user) {
    navigate('/login');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!validateRequired(formData.name)) {
      newErrors.name = 'Name is required';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!validateRequired(formData.address)) {
      newErrors.address = 'Address is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const updatedUser = await authApi.updateUser(user.id, formData);
      dispatch(updateUserProfile(updatedUser));
      setIsEditing(false);
    } catch {
      setErrors({ form: 'Failed to update profile' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      address: user.address,
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await authApi.deleteUser(user.id);
        dispatch(logout());
        navigate('/');
      } catch {
        alert('Failed to delete account');
      }
    }
  };

  return (
    <div className="animate-fadeIn max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-(--ctp-text) mb-8">My Profile</h1>

      <div className="bg-(--ctp-mantle) rounded-2xl p-8 border border-(--ctp-surface0)">
        {!isEditing ? (
          <>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-(--ctp-subtext1) mb-2">
                  Name
                </label>
                <p className="text-lg text-(--ctp-text)">{user.name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-(--ctp-subtext1) mb-2">
                  Email
                </label>
                <p className="text-lg text-(--ctp-text)">{user.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-(--ctp-subtext1) mb-2">
                  Address
                </label>
                <p className="text-lg text-(--ctp-text)">{user.address}</p>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <Button onClick={() => setIsEditing(true)} variant="primary" size="md">
                Edit Profile
              </Button>
              <Button onClick={handleDeleteAccount} variant="danger" size="md">
                Delete Account
              </Button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <Input
              label="Address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
            />

            {errors.form && (
              <p className="text-(--ctp-red) text-sm">{errors.form}</p>
            )}

            <div className="flex gap-4">
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                onClick={handleCancel}
                variant="secondary"
                size="md"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
