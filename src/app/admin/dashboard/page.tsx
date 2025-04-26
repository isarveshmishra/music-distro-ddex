'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getUsers } from '@/lib/users';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in and is admin
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      router.push('/login');
      return;
    }

    const userData = JSON.parse(currentUser);
    if (userData.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    setUser(userData);
    setUsers(getUsers());
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
                <span className="text-2xl font-bold text-indigo-600">Admin Portal</span>
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
            {/* User Management Card */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-medium text-gray-900">User Management</h3>
              <p className="mt-1 text-sm text-gray-500">Total Users: {users.length}</p>
              <button className="mt-4 rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                Manage Users
              </button>
            </div>

            {/* Content Review Card */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-medium text-gray-900">Content Review</h3>
              <p className="mt-1 text-sm text-gray-500">Review pending releases</p>
              <button className="mt-4 rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                Review Content
              </button>
            </div>

            {/* System Analytics Card */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-medium text-gray-900">System Analytics</h3>
              <p className="mt-1 text-sm text-gray-500">Monitor system performance</p>
              <button className="mt-4 rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                View Analytics
              </button>
            </div>

            {/* Revenue Management Card */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-medium text-gray-900">Revenue</h3>
              <p className="mt-1 text-sm text-gray-500">Manage revenue and payouts</p>
              <button className="mt-4 rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                View Revenue
              </button>
            </div>

            {/* Settings Card */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-medium text-gray-900">Settings</h3>
              <p className="mt-1 text-sm text-gray-500">Configure system settings</p>
              <button className="mt-4 rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                Manage Settings
              </button>
            </div>

            {/* Reports Card */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-medium text-gray-900">Reports</h3>
              <p className="mt-1 text-sm text-gray-500">Generate system reports</p>
              <button className="mt-4 rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                View Reports
              </button>
            </div>
          </div>

          {/* Recent Users Table */}
          <div className="mt-8 rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-medium text-gray-900">Recent Users</h3>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="whitespace-nowrap px-6 py-4">{user.name}</td>
                      <td className="whitespace-nowrap px-6 py-4">{user.email}</td>
                      <td className="whitespace-nowrap px-6 py-4">{user.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 