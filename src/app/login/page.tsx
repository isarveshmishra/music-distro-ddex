'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { initializeUsers, findUser } from '@/lib/users';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize users in localStorage when component mounts
    initializeUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = findUser(formData.email, formData.password);

      if (!user) {
        setError('Invalid email or password');
        setIsLoading(false);
        return;
      }

      // Store user data in localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));

      // Redirect based on user role
      if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An error occurred during login');
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-box">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div
              className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input-field rounded-t-md"
                placeholder="Email address"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input-field rounded-b-md"
                placeholder="Password"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="mt-4 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-primary-600 hover:text-primary-500">
              Sign up
            </Link>
          </p>
          <p className="mt-2 text-center text-xs text-gray-500">
            Demo Account: demo@example.com / Demo@123
          </p>
        </div>
      </div>
    </div>
  );
}
