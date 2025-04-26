'use client';

import { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalReleases: number;
  pendingReleases: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
    <p className="text-3xl font-bold text-indigo-600 mt-2">{value}</p>
    {description && <p className="text-sm text-gray-500 mt-2">{description}</p>}
  </div>
);

export default function SystemAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Simulated API call with mock data
        await new Promise(resolve => setTimeout(resolve, 1500));
        setAnalyticsData({
          totalUsers: 1250,
          activeUsers: 850,
          totalReleases: 320,
          pendingReleases: 45,
          totalRevenue: 25000,
          monthlyGrowth: 15
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-indigo-600" />
      </div>
    );
  }

  if (!analyticsData) {
    return <div>Error loading analytics data</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">System Analytics</h1>
      <p className="text-gray-600 mb-8">Overview of system performance and metrics</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={analyticsData.totalUsers}
          description="Registered users on the platform"
        />
        <StatCard
          title="Active Users"
          value={analyticsData.activeUsers}
          description="Users active in the last 30 days"
        />
        <StatCard
          title="Total Releases"
          value={analyticsData.totalReleases}
          description="Music releases on the platform"
        />
        <StatCard
          title="Pending Releases"
          value={analyticsData.pendingReleases}
          description="Releases awaiting approval"
        />
        <StatCard
          title="Total Revenue"
          value={`$${analyticsData.totalRevenue.toLocaleString()}`}
          description="Total revenue generated"
        />
        <StatCard
          title="Monthly Growth"
          value={`${analyticsData.monthlyGrowth}%`}
          description="User growth this month"
        />
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">New Users (Today)</span>
              <span className="font-semibold">25</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">New Releases (Today)</span>
              <span className="font-semibold">8</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Sessions</span>
              <span className="font-semibold">142</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Response Time</span>
              <span className="font-semibold">245ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 