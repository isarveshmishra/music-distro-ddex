'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalReleases: number;
  pendingReleases: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

interface ChartData {
  label: string;
  value: number;
}

export default function SystemAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    activeUsers: 0,
    totalReleases: 0,
    pendingReleases: 0,
    totalRevenue: 0,
    monthlyGrowth: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock analytics data
    const mockAnalytics: AnalyticsData = {
      totalUsers: 1250,
      activeUsers: 850,
      totalReleases: 320,
      pendingReleases: 45,
      totalRevenue: 25000,
      monthlyGrowth: 15
    };

    setAnalytics(mockAnalytics);
    setLoading(false);
  }, []);

  const StatCard = ({ title, value, description }: { title: string; value: string | number; description: string }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-3xl font-semibold text-indigo-600">{value}</p>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
    </div>
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">System Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">Overview of system performance and metrics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Users"
            value={analytics.totalUsers.toLocaleString()}
            description="Total registered users on the platform"
          />
          <StatCard
            title="Active Users"
            value={analytics.activeUsers.toLocaleString()}
            description="Users active in the last 30 days"
          />
          <StatCard
            title="Total Releases"
            value={analytics.totalReleases.toLocaleString()}
            description="Total music releases on the platform"
          />
          <StatCard
            title="Pending Reviews"
            value={analytics.pendingReleases.toLocaleString()}
            description="Releases waiting for review"
          />
          <StatCard
            title="Total Revenue"
            value={`$${analytics.totalRevenue.toLocaleString()}`}
            description="Total revenue generated"
          />
          <StatCard
            title="Monthly Growth"
            value={`${analytics.monthlyGrowth}%`}
            description="User growth in the last 30 days"
          />
        </div>

        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <div className="mt-4">
              <div className="border-t border-gray-200">
                <dl className="divide-y divide-gray-200">
                  <div className="py-4 flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">New Users Today</dt>
                    <dd className="text-sm text-gray-900">25</dd>
                  </div>
                  <div className="py-4 flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">New Releases Today</dt>
                    <dd className="text-sm text-gray-900">8</dd>
                  </div>
                  <div className="py-4 flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Active Sessions</dt>
                    <dd className="text-sm text-gray-900">142</dd>
                  </div>
                  <div className="py-4 flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Average Response Time</dt>
                    <dd className="text-sm text-gray-900">250ms</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 