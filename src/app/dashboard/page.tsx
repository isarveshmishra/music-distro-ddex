'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layouts/DashboardLayout';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      router.push('/login');
      return;
    }

    const userData = JSON.parse(currentUser);
    if (userData.role === 'admin') {
      router.push('/admin/dashboard');
      return;
    }

    setUser(userData);
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/login');
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Upload Music Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-900">Upload Music</h2>
          <p className="mt-2 text-gray-600">Upload your tracks for distribution</p>
          <button
            onClick={() => handleNavigation('/dashboard/releases/new')}
            className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Upload New Track
          </button>
        </div>

        {/* My Releases Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-900">My Releases</h2>
          <p className="mt-2 text-gray-600">Manage your released tracks</p>
          <button
            onClick={() => handleNavigation('/dashboard/releases')}
            className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View Releases
          </button>
        </div>

        {/* Analytics Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-900">Analytics</h2>
          <p className="mt-2 text-gray-600">Track your music performance</p>
          <button
            onClick={() => handleNavigation('/dashboard/analytics')}
            className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View Analytics
          </button>
        </div>

        {/* Royalties Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-900">Royalties</h2>
          <p className="mt-2 text-gray-600">Track your earnings</p>
          <button
            onClick={() => handleNavigation('/dashboard/royalties')}
            className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View Earnings
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-900">Profile</h2>
          <p className="mt-2 text-gray-600">Manage your account settings</p>
          <button
            onClick={() => handleNavigation('/dashboard/profile')}
            className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Edit Profile
          </button>
        </div>

        {/* Support Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-900">Support</h2>
          <p className="mt-2 text-gray-600">Get help with your account</p>
          <button
            onClick={() => handleNavigation('/dashboard/support')}
            className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Contact Support
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
} 