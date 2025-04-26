'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
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

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <span className="text-2xl font-bold text-indigo-600">Music Distribution</span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-4">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Upload Music Card */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-medium text-gray-900">Upload Music</h3>
              <p className="mt-1 text-sm text-gray-500">Upload your tracks for distribution</p>
              <button className="mt-4 rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                Upload New Track
              </button>
            </div>

            {/* My Releases Card */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-medium text-gray-900">My Releases</h3>
              <p className="mt-1 text-sm text-gray-500">Manage your released tracks</p>
              <button className="mt-4 rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                View Releases
              </button>
            </div>

            {/* Analytics Card */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-medium text-gray-900">Analytics</h3>
              <p className="mt-1 text-sm text-gray-500">Track your music performance</p>
              <button className="mt-4 rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                View Analytics
              </button>
            </div>

            {/* Royalties Card */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-medium text-gray-900">Royalties</h3>
              <p className="mt-1 text-sm text-gray-500">Track your earnings</p>
              <button className="mt-4 rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                View Earnings
              </button>
            </div>

            {/* Profile Card */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-medium text-gray-900">Profile</h3>
              <p className="mt-1 text-sm text-gray-500">Manage your account settings</p>
              <button className="mt-4 rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                Edit Profile
              </button>
            </div>

            {/* Support Card */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-medium text-gray-900">Support</h3>
              <p className="mt-1 text-sm text-gray-500">Get help with your account</p>
              <button className="mt-4 rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 